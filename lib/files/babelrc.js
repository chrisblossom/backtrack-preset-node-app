/**
 * This file is managed by backtrack
 *
 * source: @backtrack/preset-node-app
 * namespace: babel
 *
 * DO NOT MODIFY
 */

'use strict';

const Backtrack = require('@backtrack/core');

const { configManager, pkg } = new Backtrack();

const packageId = '@backtrack/preset-node-app';

const babel = {
    presets: [
        [
            pkg.resolve(packageId, 'babel-preset-env'),
            {
                targets: {
                    node: '8.9.0',
                },
                useBuiltIns: true,
            },
        ],
    ],
    plugins: [
        pkg.resolve(packageId, 'babel-plugin-dynamic-import-node'),
        pkg.resolve(packageId, 'babel-plugin-syntax-object-rest-spread'),
        [
            pkg.resolve(packageId, 'babel-plugin-transform-class-properties'),
            { spec: true },
        ],
    ],
};

module.exports = configManager({
    namespace: 'babel',
    config: babel,
});
