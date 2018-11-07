// @flow
import { last } from 'lodash';

import { type Stroke } from 'src/types';

export default function (strokes: Array<Stroke>) {
	return last(last(strokes).points);
}
