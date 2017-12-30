// @flow
import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'constants/actionTypes';
import { type SET_SCENE_INDEX_ACTION, type NEXT_SCENE_ACTION, type PREVIOUS_SCENE_ACTION } from 'actionTypeDefinitions';

function sceneIndex(state: number = 0, action: SET_SCENE_INDEX_ACTION | NEXT_SCENE_ACTION |
		PREVIOUS_SCENE_ACTION) {
	switch (action.type) {
	case SET_SCENE_INDEX:
		return Math.max(Math.min(action.number, action.max), 0);
	case NEXT_SCENE:
		return state + 1;
	case PREVIOUS_SCENE:
		return Math.max(state - 1, 0);
	default:
		return state;
	}
}

export { sceneIndex };
