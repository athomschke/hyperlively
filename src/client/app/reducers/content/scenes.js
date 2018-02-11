// @flow
import { ADD_SCENE, ADD_SCENE_AT } from 'src/client/app/constants/actionTypes';
import type { Scene } from 'src/client/app/typeDefinitions';
import type { ADD_SCENE_AT_ACTION, ADD_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { scene, sceneActionTypes, type SceneActionType } from './scene';

type ScenesActionType = SceneActionType | ADD_SCENE_AT_ACTION | ADD_SCENE_ACTION

function scenes(state: Array<Scene> = [], action: ScenesActionType) {
	switch (action.type) {
	case ADD_SCENE:
		return [
			...state,
			scene(undefined, action),
		];
	case ADD_SCENE_AT:
		return [
			...state.slice(0, action.number),
			scene(undefined, action),
			...state.slice(action.number, state.length),
		];
	default:
		if (sceneActionTypes.includes(action.type)) {
			return [
				...state.slice(0, action.sceneIndex),
				scene(state[action.sceneIndex], action),
				...state.slice(action.sceneIndex + 1, state.length),
			];
		}
		return state;
	}
}

export { scenes };
