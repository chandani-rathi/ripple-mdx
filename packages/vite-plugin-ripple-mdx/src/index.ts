import { compile } from 'ripple/compiler';
import { mdxToRipple } from './astNodeToRipple';

export default function rippleMdxPlugin({ logOutput } = { }) {
	const api = {};
	let root;
	const cssCache = new Map();

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
                const rippleSource = await mdxToRipple(code, { logOutput });
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