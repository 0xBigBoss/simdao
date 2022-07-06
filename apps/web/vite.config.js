import { sveltekit } from '@sveltejs/kit/vite';
import svelteSVG from 'vite-plugin-svelte-svg';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		svelteSVG({
			svgoConfig: {} // See https://github.com/svg/svgo#configuration
		})
	]
};

export default config;
