import { strokes } from 'reducers/strokes';
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, ADD_SCENE, ADD_SCENE_AT, SELECT, SELECT_INSIDE } from 'constants/actionTypes';

let defaultScene = () => {
	return {
		strokes: []
	};
};

function scenes (state = [defaultScene()], action) {
	switch(action.type) {
	case APPEND_POINT:
	case APPEND_STROKE:
	case FINISH_STROKE:
		if (state.length > 0) {
			let newScene = Object.assign({}, state[action.sceneIndex], {
				strokes: strokes(state[action.sceneIndex].strokes, action)
			});
			let newState = [].concat(
				state.slice(action.sceneIndex-1, action.sceneIndex),
				[newScene],
				state.slice(action.sceneIndex+1),
			);
			return newState;
		} else {
			let newState = [defaultScene()];
			newState[0].strokes = strokes(newState[0].strokes, action);
			return newState;
		}
	case HIDE:
	case SELECT:
	case SELECT_INSIDE:
	case UPDATE_POSITION: {
		let newScene = Object.assign({}, state[action.sceneIndex], {
			strokes: strokes(state[action.sceneIndex].strokes, action)
		});
		let newState = [].concat(
			state.slice(action.sceneIndex-1, action.sceneIndex),
			[newScene],
			state.slice(action.sceneIndex+1),
		);
		return newState;
	}
	case ADD_SCENE:
		return state.concat([defaultScene()]);
	case ADD_SCENE_AT:
		return state.slice(0, action.index).concat([defaultScene()], state.slice(action.index, state.length));
	default:
		return state;
	}
}

export { scenes };