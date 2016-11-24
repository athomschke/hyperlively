// export * from 'actions/configuring';
// export * from 'actions/drawing';
// export * from 'actions/manipulating';
// export * from 'actions/timetravel';

import * as configuring from 'actions/configuring';
import * as drawing from 'actions/drawing';
import * as manipulating from 'actions/manipulating';
import * as timetravel from 'actions/timetravel';

const actions = Object.assign(configuring, drawing, manipulating, timetravel);

export default actions;