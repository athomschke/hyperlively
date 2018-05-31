const context = require.context('.', true, /^(?!.*(\/integration\/|\/performance\/)).*\.spec\.(js|jsx)$/);
const srcContext = require.context('src/client/app', true, /^(?![^/]*\/[^/]*$).*/);
srcContext.keys().forEach(srcContext);
context.keys().forEach(context);
module.exports = context;
