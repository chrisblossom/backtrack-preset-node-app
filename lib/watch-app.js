'use strict';

const path = require('path');
const Nodemon = require('nodemon');
const log = require('@backtrack/core/dist/utils/log').default;
const packageId = require('./utils/package-id');

const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');

const script = path.resolve(buildPath, `${packageId}.js`);
const relativeScript = path.relative(rootPath, script);
const relativeSourcePath = path.relative(rootPath, sourcePath);

function watchApp() {
    return new Promise((resolve) => {
        /**
         * https://github.com/remy/nodemon/blob/master/doc/requireable.md
         */
        const nodemon = new Nodemon({
            script,
            ext: 'js,json',
            watch: [buildPath],
            // delay: 250,
            env: { ...process.env, FORCE_COLOR: 'true' },
        });

        nodemon.once('start', () => {
            // use setTimeout so it will end up to push log after "dev finished"
            setTimeout(() => {
                log.info(
                    `starting ${relativeScript} and watching ${relativeSourcePath}/**/*.{js,json} for changes...`
                );
            }, 1);

            resolve();
        });

        nodemon.on('restart', () => {
            log.info('restarting app...');
        });

        /**
         * Fix for terminal error
         * https://github.com/JacksonGariety/gulp-nodemon/issues/77#issuecomment-277749901
         */
        nodemon.on('quit', () => {
            process.exit();
        });
    });
}

module.exports = watchApp;
