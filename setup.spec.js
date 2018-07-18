const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

chai.use(dirtyChai);
chai.use(sinonChai);

enzyme.configure({ adapter: new Adapter() });

const context = require.context('./src', true, /\.spec\./);
context.keys().forEach(context);
