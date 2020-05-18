const path = require('path');
const exportPath = path.resolve(__dirname + '/../dist');

module.exports = {
    stats: 'errors-only',
    mode: 'production',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname + '/../dist')
    },
    externals: {
        axios: 'axios'
    },
    module: {
        exprContextCritical: false,
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            ]
        }]
    }
};
