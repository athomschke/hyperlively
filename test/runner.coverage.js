var context = require.context('.', true, /^((?![\\/]integration[\\/]).)*\.spec$/);
var srcContext = require.context('../src/client/app', true, /^(?![^\/]*\/[^\/]*$).*/);
srcContext.keys().forEach(srcContext);
context.keys().forEach(context);
module.exports = context;