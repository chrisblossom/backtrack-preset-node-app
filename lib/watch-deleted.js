'use strict';

const chokidar = require('chokidar');
const path = require('path');
const log = require('@backtrack/core/dist/utils/log').default;
const del = require('del');
const exitHook = require('./utils/exit-hook');

const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');

/**
 * babel-cli does not delete src files that have been removed.
 * watch sourcePath for deleted files and remove them from buildPath
 */
function watchDeleted({ flow = true }) {
    const watcher = chokidar.watch('**/*.{js,json}', {
        ignored: '**/*.test.js',
        cwd: sourcePath,
    });

    watcher.on('unlink', async (file) => {
        const destPath = path.resolve(buildPath, file);
        const rootRelativePath = path.relative(rootPath, destPath);

        const destPathSourceMap = `${destPath}.map`;

        const removeFiles = [destPath, destPathSourceMap];

        if (flow === true) {
            const destPathSourceFlow = `${destPath}.flow`;
            removeFiles.push(destPathSourceFlow);
        }

        try {
            await del(removeFiles);

            log.info(`${rootRelativePath} deleted`);
        } catch (error) {
            log.error(error);

            log.error(`${rootRelativePath} could not be deleted`);
        }
    });

    exitHook(() => {
        watcher.close();
    });
}

module.exports = watchDeleted;
