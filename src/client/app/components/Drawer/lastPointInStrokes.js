// @flow
import { last } from 'lodash';

import { type Stroke } from 'src/client/app/types';

export default function (strokes: Array<Stroke>) {
	return last(last(strokes).points);
}
