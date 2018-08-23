'use strict';

const Backtrack = require('@backtrack/core');

const { configManager } = new Backtrack();

const babel = {
    presets: [
        [
            require.resolve('babel-preset-env'),
            {
                targets: {
                    node: '8.9.0',
                },
                useBuiltIns: true,
            },
        ],
        require.resolve('babel-preset-flow'),
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
