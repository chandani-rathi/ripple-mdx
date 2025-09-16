import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';
import rippleMdxPlugin from 'vite-plugin-ripple-mdx';
import tailwindcss from '@tailwindcss/vite';
import rippleRouterHashPlugin from 'vite-plugin-ripple-router-hash';

export default defineConfig({
	base: './',
	plugins: [
		rippleRouterHashPlugin(),
		ripple(),
		tailwindcss(),
		rippleMdxPlugin({
			logOutput: true,
			componentMap: {},
			componentDir: '@/components/mdx',
		}),
	],
	optimizeDeps: {
		exclude: ['virtual:ripple-routes'], 
	},
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
