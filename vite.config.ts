import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			// `bun:sqlite` is a runtime builtin — never try to bundle or resolve it.
			external: [/^bun:/]
		}
	},
	optimizeDeps: {
		exclude: ['bun:sqlite']
	}
});
