# @backtrack/preset-node-app

[![npm](https://img.shields.io/npm/v/@backtrack/preset-node-app.svg?label=npm%20version)](https://www.npmjs.com/package/@backtrack/preset-node-app)
[![Linux Build Status](https://img.shields.io/circleci/project/github/chrisblossom/backtrack-preset-node-app/master.svg?label=linux%20build)](https://circleci.com/gh/chrisblossom/backtrack-preset-node-app/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/chrisblossom/backtrack-preset-node-app/master.svg?label=windows%20build)](https://ci.appveyor.com/project/chrisblossom/backtrack-preset-node-app/branch/master)
[![Code Coverage](https://img.shields.io/codecov/c/github/chrisblossom/backtrack-preset-node-app/master.svg)](https://codecov.io/gh/chrisblossom/backtrack-preset-node-app/branch/master)

## About

[`backtrack`](https://github.com/chrisblossom/backtrack) preset that bootstraps a `node >=v8.9.0` app.

## Features

-   [`babel`](https://babeljs.io/) with [`babel-preset-env`](https://babeljs.io/docs/plugins/preset-env/) targeting [`node v8.9.0`](./lib/files/babelrc.js)
-   [`flow`](https://flow.org/), [`eslint`](https://eslint.org/), and [`prettier`](https://prettier.io)
-   [`jest`](https://facebook.github.io/jest/) with [CircleCI](https://circleci.com/)
-   `package.json` scripts `build` and `dev`
-   Automatic app restarts in `development`
-   `prepush` `git hook`

## Installation

`npm install --save-dev @backtrack/preset-node-app flow-bin`

## Usage

```js
// backtrack.config.js

'use strict';

module.exports = {
    presets: ['@backtrack/node-app'],
};
```

## Options

```js
// backtrack.config.js

'use strict';

module.exports = {
    presets: [
        [
            '@backtrack/node-app',
            {
                /**
                 * Disable flow
                 *
                 * default: true
                 */
                flow: false,

                /**
                 * Use node 10
                 *
                 * default: '^8.9.0'
                 */
                nodeVersion: '^10',

                /**
                 * Use custom babel config file
                 */
                babelConfig: path.resolve(process.cwd(), '.babelrc.js'),
            },
        ],
    ],
};
```
