import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Config } from '@sveltejs/kit';

const config: Config = {
	preprocess: vitePreprocess(),
	kit: {
		// The build output is a plain JS server that Bun runs directly:
		//   bun ./build/index.js
		// Form actions are same-origin only; Kit's default CSRF origin check
		// (extend via csrf.trustedOrigins) is what we want.
		adapter: adapter()
	}
};

export default config;
