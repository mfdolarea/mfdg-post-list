const merge = require('webpack-merge');
const base = require('./base.config');

module.exports = merge(base, {
    target: 'node',
    entry: {
        'node/mfdg-post-list.min': './scripts/getPosts.js'
    }
});
