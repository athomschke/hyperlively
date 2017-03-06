import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

const isRelevantState = (states, index, sceneIndex) => {
	if (index === 0) {
		return states[index][sceneIndex] &&
			(states[index][sceneIndex].strokes ?
				states[index][sceneIndex].strokes.length > 0 :
				true);
	}
	return states[index][sceneIndex] &&
		!isEqual(states[index][sceneIndex], states[index - 1][sceneIndex]);
};

export default function (states, sceneIndex) {
	return filter(states, (state, index) => isRelevantState(states, index, sceneIndex));
}
