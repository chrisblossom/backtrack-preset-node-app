'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const log = require('@backtrack/core/dist/utils/log').default;
const { rootPath } = require('@backtrack/core/paths');
const exitHook = require('./exit-hook');
const fileExists = require('./file-exists');

const rootPathEscaped = (rootPath + path.sep).replace(/\\/g, '\\\\');

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        if (options.watch) {
            args.push('--watch');
        }

        const node = spawn(command, args, {
            env: { ...process.env, FORCE_COLOR: 'true' },
        });

        exitHook(() => {
            if (node && node.kill) {
                node.kill();
            }
        });

        node.on('close', (code) => {
            if (code !== 0) {
                reject();

                return;
            }

            resolve();
        });

        node.on('error', (error) => {
            reject(error);
        });

        let hasError = false;
        let watchResolved = false;
        let lastConsoleLog = new Date();

        node.stdout.on('data', (data) => {
            const regex = new RegExp(rootPathEscaped, 'g');
            const parsedData = data
                .toString()
                .replace(regex, '')
                .trim();

            log.info(parsedData);

            if (options.watch && watchResolved === false) {
                lastConsoleLog = new Date();
            }
        });

        node.stderr.on('data', (data) => {
            const regex = new RegExp(rootPathEscaped);
            const parsedData = data.toString().replace(regex, '');

            log.error(parsedData);

            if (options.watch && watchResolved === false) {
                lastConsoleLog = new Date();
                hasError = true;
            }
        });

        /**
         * With watch-mode we do not know when the initial build is complete.
         * Assume complete when entry file has been compiled
         *  and there hasn't been any std output
         *
         * see node.stdout and node.stderr also
         */
        if (options.watch) {
            const isDone = () => {
                setTimeout(async () => {
                    const now = new Date().getTime();
                    const diff = now - lastConsoleLog.getTime();

                    const exists = await fileExists(options.entryFile);

                    if (diff > 1000 && (exists === true || hasError === true)) {
                        watchResolved = true;
                        resolve();
                        return;
                    }

                    isDone();
                }, 50);
            };

            isDone();
        }
    });
}

runCommand.watch = () => {
    return runCommand({ watch: true });
};

module.exports = runCommand;
