import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkAdmonitions from './remarkAdmonitions';
import { enhancedComponentMap } from './componentMap';

interface RenderFunction {
 render: (node: Node, render: RenderFunction) => string
}

export interface MdxToRippleOptions {
	logOutput?: boolean;
	componentMap?: {[mdxType: string]: { name: string, from: "string"} & RenderFunction}
	componentDir?: string;
}

export async function mdxToRipple(source, { logOutput, componentMap, componentDir}: MdxToRippleOptions) {
	const processor = unified()
		.use(remarkParse)
		//.use(remarkGFM)
		//.use(remarkDirective)
        //.use(remarkRehype)
		.use(remarkMdx)        
        .use(remarkAdmonitions)
	const tree = processor.parse(source)
    const ast = await processor.run(tree)

	const componentList = enhancedComponentMap(componentDir || "@/components/mdx")
	const mergedComponentList = {
		...componentList,
		...(componentMap || {}),
	}

	const { render, getImports } = createAstToRippleRenderer(mergedComponentList);

	const imports = [];
	const body = [];

	for (const child of ast.children) {
		if (child.type === 'mdxjsEsm') {
			imports.push(child.value.trim());
		} else {
			body.push(render(child));
		}
	}

	// Combine into one component
	const rippleSource =
		`
${getImports()}
${imports.length ? imports.join('\n') + '\n\n' : ''}` +
		`export default component Page(__props) {\n` +
		`  \n` +
		`  ${body.join('\n\n  ')}\n` +
		`  \n` +
		`}`;

	return rippleSource;
}

function createAstToRippleRenderer(componentMap = {}) {
	const usedComponents = new Set<{name, from, render}>();

	function render(node) {
		const mapEntry = componentMap[node.type];

		if (mapEntry) {
			// Register that this component must be imported
			usedComponents.add(mapEntry);

			// Wrap children
			const children = node.children?.map(render).join('') || '';
			if (mapEntry.render) {
				return mapEntry.render(
                    node, 
                    (children) => children.map((n) => render(n)).join("\n")
                );
			}
            const props = buildProps(node)

			return `<${mapEntry.name}${props}>${children}</${mapEntry.name}>`;
		}

		switch (node.type) {
			case 'text':
				return `{${'`'}${escapeText(node.value)}${'`'}}`;

			case 'mdxJsxFlowElement':
			case 'mdxJsxTextElement':
				return renderJsxElement(node, render);

			case 'mdxFlowExpression':
			case 'mdxTextExpression':
				return `{${node.value}}`;

			default:
				console.warn('Unhandled node type:', node.type);
				return '';
		}
	}

	function getImports() {
		// Deduplicate imports per source
		const bySource = {};
		for (const { name, from } of usedComponents) {
			if (!from) continue;
			bySource[from] ??= [];
			bySource[from].push(name);
		}
		return Object.entries(bySource)
			.map(([from, names]) => `import { ${[...new Set(names)].join(', ')} } from "${from}"`)
			.join('\n');
	}

	return { render, getImports };
}

function escapeText(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function buildProps(node) {
  const props = []

  // Common props
  if (node.type === "link" && node.url) props.push(`href="${node.url}"`)
  if (node.type === "image" && node.url) props.push(`src="${node.url}"`)
  if (node.alt) props.push(`alt="${node.alt}"`)
  if (node.lang) props.push(`lang="${node.lang}"`)
  if (node.checked === true) props.push(`checked`)

  // Allow data from directives or custom plugins
  if (node.data) {
    for (const [key, value] of Object.entries(node.data)) {
      props.push(`${key}="${String(value)}"`)
    }
  }

  return props.length ? " " + props.join(" ") : ""
}

function renderJsxElement(node, render) {
	const attrs = (node.attributes || [])
		.map((attr) => {
			if (!attr.name) return '';
			if (attr.value == null) return attr.name;
			if (typeof attr.value === 'string') return `${attr.name}=${JSON.stringify(attr.value)}`;
			if (attr.value.type === 'mdxJsxAttributeValueExpression')
				return `${attr.name}={${attr.value.value}}`;
			return '';
		})
		.filter(Boolean)
		.join(' ');

	const children = node.children.map(render).join('');
	const openTag = `<${node.name}${attrs ? ' ' + attrs : ''}>`;

	return node.children.length === 0
		? openTag.replace(/>$/, ' />')
		: `${openTag}${children}</${node.name}>`;
}
