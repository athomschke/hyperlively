// @flow
import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';
import { setSceneIndex, nextScene, previousScene } from 'src/client/app/actionCreators';
import type { SET_SCENE_INDEX_ACTION, NEXT_SCENE_ACTION, PREVIOUS_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

export type SafeSetSceneActionType = NEXT_SCENE_ACTION | PREVIOUS_SCENE_ACTION;

export type SetSceneActionType = SafeSetSceneActionType | SET_SCENE_INDEX_ACTION;

export const setSceneIndexActions = {
	SET_SCENE_INDEX: setSceneIndex,
	NEXT_SCENE: nextScene,
	PREVIOUS_SCENE: previousScene,
};

const initialSceneIndexState = () => 0;

const sceneIndex = scopeToActions((state: number, action: SetSceneActionType) => {
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
}, setSceneIndexActions, initialSceneIndexState);

export { sceneIndex };
