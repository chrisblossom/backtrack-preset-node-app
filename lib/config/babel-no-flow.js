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
        ],
        plugins: [
            require.resolve('babel-plugin-dynamic-import-node'),
            require.resolve('@babel/plugin-proposal-class-properties'),
        ],
    };
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
