'use strict';

const path = require('path');
const runCommand = require('./utils/run-command');
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');

/**
 * Find the babel-cli bin using require instead of PATH
 */
const babelCliPath = path.parse(require.resolve('babel-cli')).dir;
const babelBinPath = path.resolve(babelCliPath, 'bin/babel.js');

const ignoreTests = path.join(rootPath, '**/*.test.js');
const ignoreSandbox = path.join(rootPath, '**/__sandbox__/*');

// TODO: Add custom babelrc option
function babel(options = {}) {
    const args = [
        sourcePath,
        '--out-dir',
        buildPath,
        '--source-maps',
        '--ignore',
        `${ignoreTests},${ignoreSandbox}`,
        // '--no-babelrc',
        // `--presets=${babelrc}`,
    ];

    if (options.watch) {
        args.push('--watch');
    }

    return runCommand(babelBinPath, args, options);
}

module.exports = babel;
