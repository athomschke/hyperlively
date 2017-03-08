// @flow
import { last } from 'lodash';
import { type Stroke } from '../typeDefinitions';

export default function (strokes: Array<Stroke>) {
	return last(last(strokes).points);
}
