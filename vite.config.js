import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from "@vitejs/plugin-legacy";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    plugins: [
        vue(),
        legacy({
            targets: ["defaults"]
        })
    ],
    base: process.env.NODE_ENV === "production"
        ? "/sites/portfolio/"
        : "/",
})
