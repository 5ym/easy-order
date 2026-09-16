import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: { preprocessorOptions: { scss: { silenceDeprecations: ['if-function'] } } },
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
