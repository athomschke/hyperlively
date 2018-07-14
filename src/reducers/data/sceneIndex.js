// @flow
import { SET_SCENE_INDEX, NEXT_SCENE, PREVIOUS_SCENE } from 'src/constants/actionTypes';
import { setSceneIndex, nextScene, previousScene } from 'src/actionCreators';
import type { SET_SCENE_INDEX_ACTION, NEXT_SCENE_ACTION, PREVIOUS_SCENE_ACTION } from 'src/actionTypeDefinitions';
import scopeToActions from 'src/reducers/scopeToActions';

export type SafeSetSceneActionType = NEXT_SCENE_ACTION | PREVIOUS_SCENE_ACTION;

export type SetSceneActionType = SafeSetSceneActionType | SET_SCENE_INDEX_ACTION;

export const setSceneIndexActions = {
	SET_SCENE_INDEX: setSceneIndex,
	NEXT_SCENE: nextScene,
	PREVIOUS_SCENE: previousScene,
};

const initialSceneIndexState = () => 0;

type SceneIndexReducer = (state: number, action: SetSceneActionType) => number

const scopedSceneIndexReducer: SceneIndexReducer = (state, action) => {
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
};

const sceneIndex = scopeToActions(scopedSceneIndexReducer, setSceneIndexActions, initialSceneIndexState);

export { sceneIndex };
