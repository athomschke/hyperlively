import { strokes } from 'reducers/strokes';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';

let defaultScene = () => {
	return {
		strokes: []
	};
};

function scenes (state = [], action) {
	switch(action.type) {
	case APPEND_POINT:
	case CREATE_STROKE:
	case FINISH_STROKE:
		if (state.length > 0) {
			state[action.sceneIndex].strokes = strokes(state[action.sceneIndex].strokes || [], action);
		} else {
			state = [defaultScene()];
			state[0].strokes = strokes(state[0].strokes, action);
		}
		return state;
	case HIDE:
	case UPDATE_BOUNDS:
		strokes(state[action.sceneIndex].strokes, action);
		return state;
	default:
		return state;
	}
}

export { scenes };