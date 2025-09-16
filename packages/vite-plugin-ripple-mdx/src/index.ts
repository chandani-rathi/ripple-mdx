import { compile } from 'ripple/compiler';
import { mdxToRipple } from './astNodeToRipple';
import fs from "node:fs";
import path from "node:path";

interface RenderFunction {
	render: (node: Node, render: RenderFunction) => string
}

export interface RippleMdxPluginOptions {
	logOutput?: boolean;
	componentMap?: { [mdxType: string]: { name: string, from: "string" } & RenderFunction }
	componentDir?: string;
}

const VITE_FS_PREFIX = '/@fs/';
const IS_WINDOWS = process.platform === 'win32';

function existsInRoot(filename, root) {
	if (filename.startsWith(VITE_FS_PREFIX)) {
		return false; // vite already tagged it as out of root
	}
	return fs.existsSync(root + filename);
}

function createVirtualImportId(filename, root, type) {
	const parts = ['ripple', `type=${type}`];
	if (type === 'style') {
		parts.push('lang.css');
	}
	if (existsInRoot(filename, root)) {
		filename = root + filename;
	} else if (filename.startsWith(VITE_FS_PREFIX)) {
		filename = IS_WINDOWS
			? filename.slice(VITE_FS_PREFIX.length) // remove /@fs/ from /@fs/C:/...
			: filename.slice(VITE_FS_PREFIX.length - 1); // remove /@fs from /@fs/home/user
	}
	// return same virtual id format as vite-plugin-vue eg ...App.ripple?ripple&type=style&lang.css
	return `${filename}?${parts.join('&')}`;
}


export default function rippleMdxPlugin({ logOutput, componentMap, componentDir }: RippleMdxPluginOptions) {
	const api = {};
	let root;
	const cssCache = new Map();
	const collectedData = [];


	function writeCollectedData() {
		
		collectedData.forEach(
			data => {
				const relativePath = data.filename.replace(/^\/+/, "");
				const outFile = path.resolve(process.cwd(),  "dist", relativePath.replace(".mdx", ""));
				fs.mkdirSync(path.dirname(outFile), { recursive: true });
				fs.writeFileSync(outFile, data.code, "utf-8");
				console.log(`[ripple-mdx]: Wrote ${data.filename} entries to ${outFile}`);
			}
		)
		
	}

	return {
		name: 'vite-plugin-ripple-mdx',
		enforce: 'pre',
		api,

		async configResolved(config) {
			root = config.root;
		},

		async load(id, opts) {
			if (cssCache.has(id)) {
				return cssCache.get(id);
			}
		},

		transform: {
			filter: { id: /\.ripple\.mdx$/ },

			async handler(code, id, opts) {
				const filename = id.replace(root, '');
				console.log("componentMap", componentMap)
				const rippleSource = await mdxToRipple(code, { logOutput, componentMap, componentDir });
				collectedData.push({ filename: filename, code: rippleSource });
				writeCollectedData()
				const { js, css } = await compile(rippleSource, filename, id);
				if (css !== '') {
					const cssId = createVirtualImportId(filename, root, 'style');
					cssCache.set(cssId, css);
					js.code += `\nimport ${JSON.stringify(cssId)};\n`;
				}
				return js;
			},
		},
	};
}