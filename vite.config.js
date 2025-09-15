import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';

export default defineConfig({
	plugins: [ripple(), tailwindcss()],
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
