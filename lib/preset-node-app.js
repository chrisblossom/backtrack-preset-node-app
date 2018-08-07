/* eslint-disable arrow-body-style */

'use strict';

const path = require('path');
const babel = require('./babel');
const flowCopySource = require('./flow-copy-source');
const watchDeleted = require('./watch-deleted');
const watchApp = require('./watch-app');
const copyFiles = require('./copy-files');
const packageId = require('./utils/package-id');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');

const relativeBuildPath = path.relative(rootPath, buildPath);
const relativeSourcePath = path.relative(rootPath, sourcePath);

module.exports = ({ options }) => {
    const { flow = true } = options;

    const preset = {
        presets: [
            '@backtrack/style',
            ['@backtrack/jest', { windows: false, isApp: true }],
        ],

        packageJson: {
            main: `${relativeBuildPath}/${packageId}.js`,
            files: [`${relativeBuildPath}/`],
            engines: {
                node: '>=8.9.0',
                npm: '>=5.6.0',
            },
            babel: { presets: ['./.babelrc.js'] },
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
            task: () => babel({ entryFile: babelEntryFile, watch: true }),
        },
        { name: 'copy files', task: () => copyFiles.watch() },
    ];

    preset.dev = [
        'backtrack clean',
        babelDev,
        () => watchDeleted({ flow }),
        () => watchApp(),
    ];

    const babelBuild = [
        { name: 'babel', task: () => babel() },
        { name: 'copy files', task: () => copyFiles() },
    ];
    preset.build = ['backtrack clean', babelBuild];

    preset.files.push(
        { src: 'files/editorconfig', dest: '.editorconfig' },
        { src: 'files/gitignore', dest: '.gitignore' }
    );

    if (flow === false) {
        preset.files.push(
            {
                src: 'files/app-entry.js',
                dest: `${relativeSourcePath}/${packageId}.js`,
                ignoreUpdates: true,
            },
            { src: 'files/babelrc.js', dest: '.babelrc.js' }
        );

        return preset;
    }

    preset.files.push(
        {
            src: 'files/app-entry-flow.js',
            dest: `${relativeSourcePath}/${packageId}.js`,
            ignoreUpdates: true,
        },
        { src: 'files/babelrc-flow.js', dest: '.babelrc.js' },
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
