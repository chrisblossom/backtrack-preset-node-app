'use strict';

module.exports = {
    presets: ['@backtrack/preset'],

    packageJson: {
        engines: {
            node: '>=8.9.0',
            npm: '>=5.6.0',
        },
    },

    config: {
        eslint: {
            overrides: [
                {
                    files: ['lib/files/app-entry*.js'],
                    parserOptions: {
                        sourceType: 'module',
                    },
                    rules: {
                        'node/no-unsupported-features/es-builtins': 'off',
                        'node/no-unsupported-features/es-syntax': 'off',
                        'node/no-unsupported-features/node-builtins': 'off',
                    },
                },
            ],
        },
    },
};
