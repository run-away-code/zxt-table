import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import fs from "fs";

// 自定义插件：构建完成后复制类型定义文件
function copyDts() {
  return {
    name: "copy-dts",
    closeBundle() {
      const src = path.resolve(__dirname, "src/index.d.ts");
      const dest = path.resolve(__dirname, "dist/index.d.ts");
      // 确保存储目录存在
      if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
      }
      fs.copyFileSync(src, dest);
      console.log(`[copy-dts] Copied ${src} to ${dest}`);
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // dts 插件在 JS 项目中生成效果不佳，改为手动维护并复制
    copyDts(),
  ],
  build: {
    // 打包为库模式
    lib: {
      entry: path.resolve(__dirname, "src/index.js"), // 入口文件
      name: "ZxtTable", // 全局变量名（UMD模式用）
      fileName: (format) => `zxt-table.${format}.js`, // 输出文件名
    },
    // 配置外部依赖（避免打包Vue和Element Plus源码）
    rollupOptions: {
      external: ["vue", "element-plus"], // 排除vue和element-plus
      output: {
        // 为外部依赖提供全局变量（UMD模式）
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus",
        },
      },
    },
  },
});
