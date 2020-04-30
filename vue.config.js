// module.exports = {
//   // transpileDependencies: ['vuetify'],
//   runtimeCompiler: true,
//   productionSourceMap: false,
//   configureWebpack: {
//     resolve: {
//       alias: {
//         handlebars: 'handlebars/dist/handlebars.js'
//       }
//     }
//   },
//   devServer: {
//     host: '0.0.0.0', // setting host allows external visitors to access local dev site.
//     port: 443, //using standard ssl port
//     hot: true, //enable hot reloading
//     inline: true, //setting the status to inline instead of iframe status bar.
//     public: 'https://cloudlocal.nanolink.com', //the url to use on network & locally.
//     https: true, //use https
//     pfx: './docker/ssl/nlWithPrivateKeyNl33.pfx', //the nl wildcard certificate. Keep secure!
//     pfxPassphrase: 'Nl3313100', //nl wildcord private key password.
//     //watchOptions: {
//     //	poll: 4000
//     //},
//     disableHostCheck: true,
//     proxy: {
//       '/api/frontend': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/rest': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/mobilebin': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/report': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/mobileapi.ashx': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/mobile': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/smscallback.ashx': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/public': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/tempaccess': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/initmobile.ashx': {
//         target: 'http://next.activate.nanolink.com'
//       },
//       '/bin': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       },
//       '/api/admin': {
//         target: 'http://cloudlocal.nanolink.com:8099'
//       }
//     }
//   }
// }

if (process.env.VUE_APP_BUILDVERSION === undefined) {
  var version = require("./package.json").version.split(".");
  process.env.VUE_APP_BUILDVERSION = version[0] + "." + version[1];
  process.env.VUE_APP_BUILDLABEL =
    version[2] + " " + process.env.VUE_APP_BUILDBRANCH;
}
