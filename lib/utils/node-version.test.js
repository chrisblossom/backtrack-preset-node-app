'use strict';

test('handles undefined pkg', () => {
    jest.doMock('read-pkg', () => {
        return {
            sync: () => undefined,
        };
    });

    const nodeVersion = require('./node-version');

    expect(nodeVersion).toEqual('8.9.0');
});

test('handles undefined engines', () => {
    jest.doMock('read-pkg', () => {
        return {
            sync: () => ({}),
        };
    });

    const nodeVersion = require('./node-version');

    expect(nodeVersion).toEqual('8.9.0');
});

test('handles undefined node', () => {
    jest.doMock('read-pkg', () => {
        return {
            sync: () => ({
                engines: {
                    npm: '^5.0.0',
                },
            }),
        };
    });

    const nodeVersion = require('./node-version');

    expect(nodeVersion).toEqual('8.9.0');
});

test('handles non-digit characters', () => {
    jest.doMock('read-pkg', () => {
        return {
            sync: () => ({
                engines: {
                    node: '>=10.0.0',
                },
            }),
        };
    });

    const nodeVersion = require('./node-version');

    expect(nodeVersion).toEqual('10.0.0');
});

test('handles empty node', () => {
    jest.doMock('read-pkg', () => {
        return {
            sync: () => ({
                engines: {
                    node: '',
                },
            }),
        };
    });

    const nodeVersion = require('./node-version');

    expect(nodeVersion).toEqual('8.9.0');
});
