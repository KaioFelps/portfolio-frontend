import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [sveltekit(), tsconfigPaths(), visualizer()],
});
