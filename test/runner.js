const context = require.context('.', true, /^((?![\\/]performance[\\/]).)*\.spec$/);
context.keys().forEach(context);
module.exports = context;
