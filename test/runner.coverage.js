const context = require.context('.', true, /^((?![\\/]integration[\\/]).)*\.spec$/);
const srcContext = require.context('../src/client/app', true, /^(?![^/]*\/[^/]*$).*/);
srcContext.keys().forEach(srcContext);
context.keys().forEach(context);
module.exports = context;
