const merge = require('webpack-merge');
const base = require('./base.config');

module.exports = merge(base, {
    target: 'web',
    entry: {
        'web/mfdg-post-list.min': './scripts/getPosts.js'
    }
});
