// @flow
import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';
import type { SET_SCENE_INDEX_ACTION, NEXT_SCENE_ACTION, PREVIOUS_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

export type SafeSetSceneActionType = NEXT_SCENE_ACTION | PREVIOUS_SCENE_ACTION;

export type SetSceneActionType = SafeSetSceneActionType | SET_SCENE_INDEX_ACTION;

export const sceneIndexActionTypes = [SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE];

export const initialSceneIndexState = () => 0;

function sceneIndex(state: number = initialSceneIndexState(), action: SetSceneActionType) {
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
