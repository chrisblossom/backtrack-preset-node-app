'use strict';

const Backtrack = require('@backtrack/core');
const nodeVersion = require('../utils/node-version');

const { configManager } = new Backtrack();

const babel = {
    presets: [
        [
            require.resolve('babel-preset-env'),
            {
                targets: {
                    node: nodeVersion,
                },
                useBuiltIns: true,
            },
        ],
    ],
    plugins: [
        require.resolve('babel-plugin-dynamic-import-node'),
        require.resolve('babel-plugin-syntax-object-rest-spread'),
        [
            require.resolve('babel-plugin-transform-class-properties'),
            { spec: true },
        ],
    ],
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
