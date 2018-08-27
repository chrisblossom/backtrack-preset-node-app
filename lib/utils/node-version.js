'use strict';

const readPkg = require('read-pkg');

const pkg = readPkg.sync({ normalize: false }) || {};
const engines = pkg.engines || {};
const node = engines.node || '8.9.0';
const nodeVersion = node.replace(/[^(\d)(.)]/g, '');

module.exports = nodeVersion;
