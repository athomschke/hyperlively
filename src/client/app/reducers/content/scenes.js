// @flow
import produce from 'immer';

import { ADD_SCENE, ADD_SCENE_AT } from 'src/client/app/constants/actionTypes';
import { hide, select } from 'src/client/app/actions/manipulating';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { Scene } from 'src/client/app/typeDefinitions';
import type { ADD_SCENE_AT_ACTION, ADD_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { scene, sceneActionTypes, initialSceneState, sceneActions, type SceneActionType } from './scene';

export type ScenesActionType = SceneActionType | ADD_SCENE_AT_ACTION | ADD_SCENE_ACTION

export const scenesActionTypes = [...sceneActionTypes, ADD_SCENE, ADD_SCENE_AT];

export const scenesActions = {
	...sceneActions,
	ADD_SCENE: hide,
	ADD_SCENE_AT: select,
};

export const initialScenesState = (): Array<Scene> => [];

const scenes =
scopeToActions((state: Array<Scene> = initialScenesState(), action: ScenesActionType) =>
produce(state, (draftState) => {
	switch (action.type) {
	case ADD_SCENE:
		draftState.push(initialSceneState());
		break;
	case ADD_SCENE_AT:
		draftState.splice(action.number, 0, initialSceneState());
		break;
	default:
		if (sceneActionTypes.includes(action.type)) {
			draftState.splice(action.sceneIndex, 1, scene(state[action.sceneIndex], action));
		}
	}
}), scenesActions, initialSceneState());

export { scenes };
