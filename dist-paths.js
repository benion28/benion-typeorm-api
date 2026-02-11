// dist-paths.js - Register path aliases for production
const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAliases({
  '@': path.join(__dirname, 'dist')
});
