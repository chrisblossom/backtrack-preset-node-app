/* @flow */

/**
 * app entry file
 */

// import 'source-map-support/register';

async function hello() {
    await import('./other.js');
}

hello();
