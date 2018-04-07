// @flow
import produce from 'immer';

import { ADD_SCENE, ADD_SCENE_AT } from 'src/client/app/constants/actionTypes';
import type { Scene } from 'src/client/app/typeDefinitions';
import type { ADD_SCENE_AT_ACTION, ADD_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { scene, sceneActionTypes, type SceneActionType } from './scene';

type ScenesActionType = SceneActionType | ADD_SCENE_AT_ACTION | ADD_SCENE_ACTION

const scenes = (state: Array<Scene> = [], action: ScenesActionType) =>
produce(state, (draftState) => {
	switch (action.type) {
	case ADD_SCENE:
		draftState.push(scene(undefined, action));
		break;
	case ADD_SCENE_AT:
		draftState.splice(action.number, 0, scene(undefined, action));
		break;
	default:
		if (sceneActionTypes.includes(action.type)) {
			draftState.splice(action.sceneIndex, 1, scene(state[action.sceneIndex], action));
		}
	}
});

export { scenes };
