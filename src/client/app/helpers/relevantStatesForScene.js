// @flow
// import isEqual from 'lodash/isEqual';
// import filter from 'lodash/filter';
import { type SceneState } from 'src/client/app/typeDefinitions';

// export default function (states: Array<Scene>, sceneIndex: number) {
export default function (states: Array<SceneState>, _sceneIndex: number) {
	return states;
	// return filter(states, (state, index) => {
	// 	if (index === 0) {
	// 		return states[index][sceneIndex] &&
	// 			(states[index][sceneIndex].strokes ?
	// 				states[index][sceneIndex].strokes.length > 0 :
	// 				true);
	// 	}
	// 	return states[index][sceneIndex] &&
	// 		!isEqual(states[index][sceneIndex], states[index - 1][sceneIndex]);
	// });
}
