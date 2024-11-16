import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from "path";

export default defineConfig({
  html: {
		template: path.join(__dirname, "index.html"),
	},
	source: {
		alias: {
			"@/": path.join(__dirname, "src"),
		},
	},
	output: {
		distPath: {
			root: "dist",
		},
	},
	server: {
    open: false,
		host: "0.0.0.0",
		port: 8888,
		proxy: {
			"/api": {
				target: process.env.PUBLIC_API_URL,
				changeOrigin: true,
			},
		},
		
	},
  plugins: [pluginReact()],
});
