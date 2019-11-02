const
    mix = require('laravel-mix'),
    workboxPlugin = require('workbox-webpack-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
    plugins: [
        new workboxPlugin.GenerateSW({
            swDest: 'service-worker.js',
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: new RegExp('/'), // 全てキャッシュする
                    handler: 'NetworkFirst'
                }
            ]
        })
    ],
    output: {
        publicPath: ''
    }
});

mix.react('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css', {
        includePaths: [path.resolve(__dirname, 'node_modules')]
    }).version();
