'use strict';

const path = require('path');
const copy = require('recursive-copy');
const chokidar = require('chokidar');
const log = require('@backtrack/core/dist/utils/log').default;
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');
const exitHook = require('./utils/exit-hook');

const fileMatcher = '**/*.json';

async function copyFiles() {
    const copying = copy(sourcePath, buildPath, {
        overwrite: true,
        dot: true,
        filter: fileMatcher,
    });

    copying.on(copy.events.COPY_FILE_COMPLETE, ({ src, dest }) => {
        const relativeSrc = path.relative(rootPath, src);
        const relativeDest = path.relative(rootPath, dest);

        log.info(`${relativeSrc} -> ${relativeDest}`);
    });

    await copying;
}

async function handleUpdatedFile(pathname) {
    const relativeSourcePath = path.relative(sourcePath, pathname);
    const relativeRootPath = path.relative(rootPath, pathname);

    const destPath = path.resolve(buildPath, relativeSourcePath);
    const rootRelativePath = path.relative(rootPath, destPath);

    try {
        await copy(pathname, destPath, {
            overwrite: true,
        });

        log.info(`${relativeRootPath} -> ${rootRelativePath}`);
    } catch (error) {
        log.error(error);

        log.error(`${relativeRootPath} could not be copied`);
    }
}

async function copyFilesWatch() {
    const pendingCopy = [];

    await new Promise((resolve) => {
        let isResolved = false;
        const watcher = chokidar.watch(fileMatcher, {
            cwd: sourcePath,
        });

        watcher.on('ready', () => {
            isResolved = true;

            resolve();
        });

        watcher.on('add', (file) => {
            const fullFilePath = path.join(sourcePath, file);

            const result = handleUpdatedFile(fullFilePath);

            if (isResolved === false) {
                pendingCopy.push(result);
            }

            return result;
        });

        watcher.on('change', (file) => {
            const fullFilePath = path.join(sourcePath, file);

            return handleUpdatedFile(fullFilePath);
        });

        exitHook(() => {
            watcher.close();
        });
    });

    await Promise.all(pendingCopy);
}

copyFiles.watch = copyFilesWatch;
module.exports = copyFiles;
