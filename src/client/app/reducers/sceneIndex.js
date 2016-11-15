import { SET_SCENE_INDEX } from 'constants/actionTypes';

function sceneIndex (state = 0, action) {
	switch(action.type) {
	case SET_SCENE_INDEX:
		return action.index;
	default:
		return state;
	}
}

export { sceneIndex };