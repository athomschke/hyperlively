// @flow
import produce from 'immer';

import { ADD_SCENE, ADD_SCENE_AT } from 'src/client/app/constants/actionTypes';
import { hide, select } from 'src/client/app/actionCreators';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { Scene } from 'src/client/app/typeDefinitions';
import type { ADD_SCENE_AT_ACTION, ADD_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { scene, sceneActions, type SceneActionType } from './scene';

export type ScenesActionType = SceneActionType | ADD_SCENE_AT_ACTION | ADD_SCENE_ACTION

export const scenesActions = {
	...sceneActions,
	ADD_SCENE: hide,
	ADD_SCENE_AT: select,
};

const initialScenesState = (): Array<Scene> => [];

type ScopedScenesReducer = (state: Array<Scene>, action: ScenesActionType) => Array<Scene>

const scopedScenesReducer: ScopedScenesReducer = (state, action) => produce(state, (draftState) => {
	switch (action.type) {
	case ADD_SCENE:
		draftState.push(scene(undefined, { type: '' }));
		break;
	case ADD_SCENE_AT:
		draftState.splice(action.number, 0, scene(undefined, { type: '' }));
		break;
	default:
		if (Object.keys(sceneActions).includes(action.type)) {
			draftState.splice(action.sceneIndex, 1, scene(state[action.sceneIndex], action));
		}
	}
});

const scenes =
scopeToActions(scopedScenesReducer, scenesActions, initialScenesState);

export { scenes };
