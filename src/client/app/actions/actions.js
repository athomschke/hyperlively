import * as configuring from './configuring';
import * as drawing from './drawing';
import * as manipulating from './manipulating';
import * as timetravel from './timetravel';

const actions = Object.assign(configuring, drawing, manipulating, timetravel);

export default actions;
