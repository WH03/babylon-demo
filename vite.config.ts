import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
// ant design vue按需加载
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
// 引入resolve
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  // 修改启动端口
  //修改启动的
  server: {
    host: '0.0.0.0', // 这个用于启动
    port: 8080, // 指定启动端口
    open: true //启动后是否自动打开浏览器
  },
  // 设置scss的api类型为modern-compiler
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    // 设置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "*": resolve(""),
    },
  },
});