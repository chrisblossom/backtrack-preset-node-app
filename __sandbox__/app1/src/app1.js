/* @flow */

/**
 * app entry file
 */

// import 'source-map-support/register';

async function hello() {
    await import('./other.js');

    const one = { one: 1 };
    const two = { two: 1 };

    return { ...one, ...two };
}

hello();
