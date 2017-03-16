const context = require.context('.', true, /(((\/performance\/)).*\.spec\.(js|jsx))$/);
context.keys().forEach(context);
module.exports = context;
