import { last } from 'lodash';

export default function (strokes) {
	return last(last(strokes).points);
}
