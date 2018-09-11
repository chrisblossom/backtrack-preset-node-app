'use strict';

const path = require('path');
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');
const runCommand = require('./utils/run-command');

/**
 * Find the babel-cli bin using require instead of PATH
 */
const babelCliPath = path.parse(require.resolve('@babel/cli')).dir;
const babelBinPath = path.resolve(babelCliPath, 'bin/babel.js');

const ignoreTests = path.join(rootPath, '**/*.test.js');
const ignoreSandbox = path.join(rootPath, '**/__sandbox__/*');

function babel(options = {}) {
    const args = [
        sourcePath,
        '--out-dir',
        buildPath,
        '--source-maps',
        '--ignore',
        `${ignoreTests},${ignoreSandbox}`,
    ];

    if (options.watch) {
        args.push('--watch');
    }

    return runCommand(babelBinPath, args, options);
}

module.exports = babel;
