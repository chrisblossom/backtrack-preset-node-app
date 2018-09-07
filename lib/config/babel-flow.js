'use strict';

const Backtrack = require('@backtrack/core');
const nodeVersion = require('../utils/node-version');

const { configManager } = new Backtrack();

const babel = () => {
    return {
        presets: [
            [
                require.resolve('@babel/preset-env'),
                {
                    targets: {
                        node: nodeVersion,
                    },
                    useBuiltIns: 'entry',
                },
            ],
            require.resolve('@babel/preset-flow'),
        ],
        plugins: [
            require.resolve('babel-plugin-dynamic-import-node'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-transform-strict-mode'),
        ],
    };
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
