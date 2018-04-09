// @flow
import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';
import type { ENHANCED_SET_SCENE_INDEX_ACTION, NEXT_SCENE_ACTION, PREVIOUS_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

type Action = ENHANCED_SET_SCENE_INDEX_ACTION | NEXT_SCENE_ACTION | PREVIOUS_SCENE_ACTION;

function sceneIndex(state: number = 0, action: Action) {
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
