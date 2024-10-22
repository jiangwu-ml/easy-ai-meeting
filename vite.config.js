import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

/** 关于 import.meta.env
 * 1. 默认情况下，开发服务器 (dev 命令) 运行在 development (开发) 模式，而 build 命令则运行在 production (生产) 模式。，
 * 2. 不管在哪种环境下，你可以通过在代码中使用import.meta.env.xxx  来调用对应环境的 .env文件 下变量的值，如果是开发环境，就会读取.env.development中的值，生产环境，就会读取.env.production中的值。
 * 3. 为了防止意外地将一些环境变量泄漏到客户端，只有以 VITE_ 为前缀的变量才会暴露给经过 vite 处理的代码。
 * 4. vite.config.js 无法直接读取环境变量。需要使用 loadEnv(mode, process.cwd())才能访问到import.meta.env。
 * */

/** 关于： loadEnv(mode, process.cwd()).VITE_BASE_URL
 * 1. mode：development (开发)、production (生产)...
 * 2. process.cwd()： 项目根目录root（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。
 * 3. loadEnv 读取位于当前工作目录（由 process.cwd() 确定）下的mode环境下的环境变量文件。将文件中的环境变量加载到 process.env 对象中，使得这些变量可以在 Node.js 进程中通过 process.env.VARIABLE_NAME 访问。
 * 参考：https://blog.csdn.net/qq_45429889/article/details/124837035
 * */

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const VITE_BASE_URL = loadEnv(mode, process.cwd()).VITE_BASE_URL;

  return {
    base: VITE_BASE_URL, //部署路径时的基础路径
    plugins: [react()],
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        '@': path.resolve(__dirname, './src'),
      },
      hmr: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/style/variables.scss";',
          javascriptEnabled: true,
        },
      },
    },
    server: {
      // 此代理只能在开发环境。即：yarn start时生效
      proxy: {
        '/api': {
          target: 'http://123.60.160.90:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
