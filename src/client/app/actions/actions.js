// @flow
import * as configuring from './configuring';
import * as drawing from './drawing';
import * as manipulating from './manipulating';

const actions = Object.assign({}, configuring, drawing, manipulating);

export default actions;
