// @flow
import {
	APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE,
	SELECT, SELECT_INSIDE, ROTATE_BY,
	ADD_SCENE,
	ADD_SCENE_AT,
} from 'src/client/app/constants/actionTypes';
import type { Scene } from 'src/client/app/typeDefinitions';
import type {
	APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, HIDE_ACTION,
	SELECT_ACTION, SELECT_INSIDE_ACTION, UPDATE_POSITION_ACTION, ROTATE_BY_ACTION,
	ADD_SCENE_AT_ACTION,
	ADD_SCENE_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { scene } from './scene';

type ScenesActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION | UPDATE_POSITION_ACTION | ROTATE_BY_ACTION |
ADD_SCENE_AT_ACTION | ADD_SCENE_ACTION

function scenes(state: Array<Scene> = [], action: ScenesActionType) {
	switch (action.type) {
	case APPEND_POINT:
	case APPEND_STROKE:
	case FINISH_STROKE:
	case HIDE:
	case SELECT:
	case SELECT_INSIDE:
	case UPDATE_POSITION:
	case ROTATE_BY:
		return [
			...state.slice(0, action.sceneIndex),
			scene(state[action.sceneIndex], action),
			...state.slice(action.sceneIndex + 1, state.length),
		];
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
		return state;
	}
}

export { scenes };
