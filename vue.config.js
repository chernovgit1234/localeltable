const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/localeltable/',
  transpileDependencies: [
    'quasar'
  ],
  /* plugins: [
    // ignore all Moment.js locale files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ], */
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  
})