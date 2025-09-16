export const defaultComponentMap = {
	heading: {
		name: 'h',
		from: '',
		render: (node, renderChildren) => {
			const tag = `h${node.depth}`;
			return `<${tag}>${renderChildren(node.children)}</${tag}>`;
		},
	},
	paragraph: { name: 'p', from: '' },
	strong: { name: 'strong', from: '' },
	emphasis: { name: 'em', from: '' },
	blockquote: { name: 'blockquote', from: '' },
	list: {
		name: 'ul', // default fallback
		from: '',
		render: (node, renderChildren) => {
			const tag = node.ordered ? 'ol' : 'ul';
			return `<${tag}>${renderChildren(node.children)}</${tag}>`;
		},
	},
	listItem: { name: 'li', from: '' },
	thematicBreak: { name: 'hr', from: '' },
	inlineCode: { name: 'code', from: '' },
	code: {
		name: 'pre',
		from: '',
		render: (node) =>
			`<pre><code${node.lang ? ` class="language-${node.lang}"` : ''}>${node.value}</code></pre>`,
	},
	link: {
		name: 'a',
		from: '',
		render: (node, renderChildren) =>
			`<a href="${node.url}"${node.title ? ` title="${node.title}"` : ''}>${renderChildren(node.children)}</a>`,
	},
	image: {
		name: 'img',
		from: '',
		render: (node) => `<img src="${node.url}" alt="${node.alt ?? ''}" />`,
	},
	table: { name: 'table', from: '' },
	tableRow: { name: 'tr', from: '' },
	tableCell: { name: 'td', from: '' },
	delete: { name: 'del', from: '' },
	break: { name: 'br', from: '' },
};

export const enhancedComponentMap = {
	// --- Base Markdown (inherits from defaultComponentMap) ---
	...defaultComponentMap,

	// --- GitHub-style Enhancements ---
	taskListItem: {
		name: 'li',
		from: '',
		render: (node, renderChildren) => {
			// remark-gfm adds `checked` to taskListItem nodes
			const checkbox = `<input type="checkbox" disabled ${node.checked ? 'checked="checked"' : ''} />`;
			return `<li class="task-list-item">${checkbox} ${renderChildren(node.children)}</li>`;
		},
	},

	// --- Admonitions / Callouts ---
	admonition: {
		name: 'Callout',
		from: '@/components/Callout.ripple',
		render: (node, renderChildren) => {
			// node.data?.admonitionType provided by custom remark plugin
			const type = node.data?.admonitionType || 'note';
			return `<Callout type="${type}">${renderChildren(node.children)}</Callout>`;
		},
	},

	// --- Badges ---
	badge: {
		name: 'Badge',
		from: '@/components/Badge.ripple',
		render: (node) => {
			const text = node.value || '';
			const color = node.data?.color || 'gray';
			return `<Badge color="${color}">${text}</Badge>`;
		},
	},

	// --- Figures / Captions ---
	figure: {
		name: 'Figure',
		from: '@my/ui',
		render: (node, renderChildren) => `<figure>${renderChildren(node.children)}</figure>`,
	},
	figcaption: {
		name: 'figcaption',
		from: '',
		render: (node, renderChildren) =>
			`<figcaption>${renderChildren(node.children)}</figcaption>`,
	},

	// --- Code Block with Title ---
	codeBlock: {
		name: 'CodeBlock',
		from: '@my/ui',
		render: (node) => {
			const title = node.meta?.match(/title="([^"]+)"/)?.[1] || '';
			const lang = node.lang || 'plaintext';
			return `<CodeBlock language="${lang}" title="${title}">${node.value}</CodeBlock>`;
		},
	},

	// --- Mermaid / Diagrams ---
	mermaid: {
		name: 'Mermaid',
		from: '@my/ui',
		render: (node) => `<Mermaid>{\`${node.value}\`}</Mermaid>`,
	},

	// --- Include / Partial Content ---
	include: {
		name: 'Include',
		from: '',
		render: (node) => {
			// node.value = path to include
			return `{/* include: ${node.value} */}`;
		},
	},

	// --- Tabs / Custom Directives ---
	tabs: {
		name: 'Tabs',
		from: '@my/ui',
		render: (node, renderChildren) => `<Tabs>${renderChildren(node.children)}</Tabs>`,
	},
	tabItem: {
		name: 'TabItem',
		from: '@my/ui',
		render: (node, renderChildren) => {
			const label = node.data?.label || 'Tab';
			return `<TabItem label="${label}">${renderChildren(node.children)}</TabItem>`;
		},
	},
};