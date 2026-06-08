// Configuration for your app
import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'

export default defineConfig((ctx) => {
  return {
    // Sem boot extra — Pinia registrado via stores/index.js
    boot: ['notificacoes'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      vueRouterMode: 'history',
      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.modeName === 'ssr',
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
          },
        ],
        [
          'vite-plugin-checker',
          {
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },

    devServer: { open: true },

    framework: {
      config: {
        notify: { position: 'top', timeout: 2500 },
      },
      plugins: ['Notify', 'Dialog'],
    },

    animations: [],
    ssr: { prodPort: 3000, middlewares: ['render'], pwa: false },
    pwa: { workboxMode: 'GenerateSW' },
    cordova: {},
    capacitor: { hideSplashscreen: true },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      builder: { appId: 'quasar-project' },
    },
    bex: { extraScripts: [] },
  }
})
