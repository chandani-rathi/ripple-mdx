import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';

export default defineConfig({
	plugins: [ripple({})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		target: 'esnext',
		manifest: false,
		minify: false,
		lib: {
			entry: "src/index.ts",
			fileName: (format) => `index.${format}.js`,
			formats: ['es'], 
		},
		rollupOptions: {
			input: 'src/index.ts',
			output: {
				dir: 'dist',
				globals: {},
				exports: 'named',
			},
			external: [
				'ripple', 
				'ripple/compiler', 
				'ripple/internal/client',
				'unified',
				'remark-parse',
				'remark-mdx'
			],
		},
	},
});
