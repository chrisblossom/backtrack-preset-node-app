'use strict';

const readPkg = require('read-pkg');

// get package name for entry file name
const pkgName = readPkg.sync({ normalize: false }).name;

// remove scope from packageId
const packageId = pkgName.split('/').pop();

module.exports = packageId;
