const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');

chai.use(dirtyChai);
chai.use(sinonChai);

const context = require.context('./integration/', true, /^.*\.spec\..*$/);
context.keys().forEach(context);
module.exports = context;
