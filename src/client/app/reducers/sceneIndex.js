import { SET_SCENE_INDEX } from 'constants/actionTypes';

function sceneIndex (state = 0, action) {
	switch(action.type) {
	case SET_SCENE_INDEX:
		return Math.max(Math.min(action.index, action.max), 0);
	default:
		return state;
	}
}

export { sceneIndex };