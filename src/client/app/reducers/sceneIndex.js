import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'constants/actionTypes';

function sceneIndex(state = 0, action) {
	switch (action.type) {
	case SET_SCENE_INDEX:
		return Math.max(Math.min(action.index, action.max), 0);
	case NEXT_SCENE:
		return state + 1;
	case PREVIOUS_SCENE:
		return Math.max(state - 1, 0);
	default:
		return state;
	}
}

export { sceneIndex };
