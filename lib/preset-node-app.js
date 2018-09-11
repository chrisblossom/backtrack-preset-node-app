/* eslint-disable arrow-body-style */

'use strict';

const path = require('path');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');
const log = require('@backtrack/core/dist/utils/log').default;
const babel = require('./babel');
const flowCopySource = require('./flow-copy-source');
const watchDeleted = require('./watch-deleted');
const watchApp = require('./watch-app');
const copyFiles = require('./copy-files');
const packageId = require('./utils/package-id');

const relativeBuildPath = path.relative(rootPath, buildPath);
const relativeSourcePath = path.relative(rootPath, sourcePath);

module.exports = ({ options }) => {
    const {
        flow = true,
        nodeVersion = '^8.9.0',
        npmVersion = '>=5.6.0',
    } = options;
    let { babelConfig } = options;

    const preset = {
        presets: [
            '@backtrack/style',
            ['@backtrack/jest', { windows: false, isApp: true }],
        ],

        packageJson: {
            main: `${relativeBuildPath}/${packageId}.js`,
            files: [`${relativeBuildPath}/`],
            engines: {
                node: nodeVersion,
                npm: npmVersion,
            },
        },

        files: [],
    };

    preset.prepublishOnly = [false];
    preset['test.ci-pretest'] = ['backtrack lint'];
    preset.clean = { del: ['**/*'] };

    const babelEntryFile = path.resolve(buildPath, `${packageId}.js`);
    const babelDev = [
        {
            name: 'babel',
            task: () =>
                babel({
                    flow,
                    entryFile: babelEntryFile,
                    watch: true,
                }),
        },
        { name: 'copy files', task: () => copyFiles.watch() },
    ];

    preset.dev = [
        'backtrack clean',
        babelDev,
        () => watchDeleted({ flow }),
        () => watchApp(),
    ];

    preset['dev.watch-only'] = [
        'backtrack clean',
        babelDev,
        () => watchDeleted({ flow }),
        () => {
            setTimeout(() => {
                log.info(
                    `watching ${relativeSourcePath}/**/*.{js,json} for changes...`
                );
            }, 1);
        },
    ];

    const babelBuild = [
        { name: 'babel', task: () => babel({ flow }) },
        { name: 'copy files', task: () => copyFiles() },
    ];
    preset.build = ['backtrack clean', babelBuild];

    preset.files.push(
        { src: 'files/editorconfig', dest: '.editorconfig' },
        { src: 'files/gitignore', dest: '.gitignore' }
    );

    if (flow === false) {
        babelConfig = babelConfig || '@backtrack/preset-node-app/babel-no-flow';
        preset.packageJson.babel = { presets: [babelConfig] };

        preset.files.push({
            src: 'files/app-entry.js',
            dest: `${relativeSourcePath}/${packageId}.js`,
            ignoreUpdates: true,
        });

        return preset;
    }

    babelConfig = babelConfig || '@backtrack/preset-node-app/babel-flow';
    preset.packageJson.babel = { presets: [babelConfig] };

    preset.files.push(
        {
            src: 'files/app-entry-flow.js',
            dest: `${relativeSourcePath}/${packageId}.js`,
            ignoreUpdates: true,
        },
        { src: 'files/jest.flow', dest: 'flow-typed/jest.js' },
        { src: 'files/flowconfig', dest: '.flowconfig' }
    );

    preset.flow = ['flow'];
    preset.prepush = ['backtrack build', 'backtrack flow'];
    preset['test.ci-pretest'].push('backtrack build', {
        name: 'flow ci',
        task: 'flow check',
    });

    const flowEntryFile = path.resolve(buildPath, `${packageId}.js.flow`);
    babelDev.push({
        name: 'flow-copy-source',
        task: () => flowCopySource({ entryFile: flowEntryFile, watch: true }),
    });

    babelBuild.push({
        name: 'flow-copy-source',
        task: () => flowCopySource(),
    });

    return preset;
};
