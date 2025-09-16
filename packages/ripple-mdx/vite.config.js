import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';
import rippleMdxPlugin from 'vite-plugin-ripple-mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	base: './',
	plugins: [
		ripple(), 
		tailwindcss(), 
		rippleMdxPlugin({ 
			logOutput: true, 
			componentMap: {
			}, 
			componentDir: "@/components/mdx"
		 })
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
