const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const jsLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader'
    }
};

const vueLoader = {
    test: /\.(vue)$/,
    use: 'vue-loader'
};

const sass = require('sass');
console.log(sass);

const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
        'style-loader',
        'css-loader',
        {
            loader: 'sass-loader',
            options: {
                implementation: sass,
                includePaths: ['node_modules/dart-sass']
            },
        },
    ],
}

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [jsLoader, vueLoader, scssLoader]
    },
    externals: {
        electron: 'require("electron")',
        fs: 'require("fs")',
        path: 'require("path")',
        util: 'require("util")',
        process: 'require("process")',
        net: 'require("net")',
        request: 'require(require("path").join(require("electron").remote.app.getAppPath(), "node_modules", "request"))',
        sparkplug: 'require("../../core/dist/sparkplug")',
        'node-crypto': 'require("crypto")',
        'child_process': 'require("child_process")'
    },
    resolve: {
        alias: {
            vue$: path.resolve('..', 'node_modules', 'vue', 'dist', 'vue.esm.js')
        },
        modules: [
            path.resolve('..', 'node_modules'),
            path.resolve('..', 'common', 'modules'),
            path.resolve('src', 'modules'),
            path.resolve('src', 'ui'),
            path.resolve('src', 'plugins'),
            path.resolve('src', 'structs'),
            path.resolve('src', 'builtin')
        ]
    },
    node: {
        process: false,
        __filename: false,
        __dirname: false
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
