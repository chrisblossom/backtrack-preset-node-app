'use strict';

const path = require('path');
const runCommand = require('./utils/run-command');
const { sourcePath, buildPath } = require('@backtrack/core/paths');

/**
 * Find the flow-copy-source bin using require instead of PATH
 */
const copyFlowSourcePath = path.parse(require.resolve('flow-copy-source')).dir;
const copyFlowSourceBinPath = path.resolve(
    copyFlowSourcePath,
    '../bin/flow-copy-source.js'
);

function flowCopySource(options = {}) {
    const args = [
        '--ignore',
        '**/*.test.js',
        '--ignore',
        '**/__sandbox__/**',
        sourcePath,
        buildPath,
    ];

    if (options.watch) {
        args.unshift('--watch');
    }

    return runCommand(copyFlowSourceBinPath, args, options);
}

module.exports = flowCopySource;
