import { strokes } from 'reducers/strokes';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, ADD_SCENE, ADD_SCENE_AT, SELECT, SELECT_INSIDE } from 'constants/actionTypes';

let defaultScene = () => {
	return {
		strokes: []
	};
};

function scenes (state = [defaultScene()], action) {
	switch(action.type) {
	case APPEND_POINT:
	case CREATE_STROKE:
	case FINISH_STROKE:
		if (state.length > 0) {
			state[action.sceneIndex].strokes = strokes(state[action.sceneIndex].strokes, action);
		} else {
			state = [defaultScene()];
			state[0].strokes = strokes(state[0].strokes, action);
		}
		return state;
	case HIDE:
	case SELECT:
	case SELECT_INSIDE:
	case UPDATE_POSITION:
		strokes(state[action.sceneIndex].strokes, action);
		return state;
	case ADD_SCENE:
		return state.concat([defaultScene()]);
	case ADD_SCENE_AT:
		return state.slice(0, action.index).concat([defaultScene()], state.slice(action.index, state.length));
	default:
		return state;
	}
}

export { scenes };