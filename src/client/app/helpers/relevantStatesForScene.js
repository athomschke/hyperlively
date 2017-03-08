// @flow
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import { type Scene } from '../typeDefinitions';

export default function (states: Array<Scene>, sceneIndex: number) {
	return filter(states, (state, index) => {
		if (index === 0) {
			return states[index][sceneIndex] &&
				(states[index][sceneIndex].strokes ?
					states[index][sceneIndex].strokes.length > 0 :
					true);
		}
		return states[index][sceneIndex] &&
			!isEqual(states[index][sceneIndex], states[index - 1][sceneIndex]);
	});
}
