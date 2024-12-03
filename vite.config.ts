import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium-build";
import path from "path";
import svgr from "vite-plugin-svgr";
import { viteStaticCopy } from "vite-plugin-static-copy";
import copy from "rollup-plugin-copy";

export default defineConfig({
    plugins: [
        react(),
        cesium(),
        svgr({
            svgrOptions: {
                // svgr options
            }
        }),
        viteStaticCopy({
            targets: [
                {
                    src: resolve("node_modules", "@esri", "calcite-components", "dist", "calcite", "assets"),
                    dest: "."
                }
            ]
        }),
        copy({
            targets: [
                {
                    src: "node_modules/@esri/calcite-components/dist/calcite/assets/",
                    dest: "public/"
                }
            ]
        })
    ],
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "./src/core")
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler" // or "modern"
            }
        }
    }
});
