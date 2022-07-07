import { sveltekit } from '@sveltejs/kit/vite';
import svg from 'vite-plugin-svelte-svgr';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), svg()]
};

export default config;
