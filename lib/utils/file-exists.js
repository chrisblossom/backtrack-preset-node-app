'use strict';

const fs = require('fs');
const { promisify } = require('util');

const fsAccess = promisify(fs.access);

async function fileExists(file) {
    try {
        await fsAccess(file);

        return true;
    } catch (error) {
        return false;
    }
}

module.exports = fileExists;
