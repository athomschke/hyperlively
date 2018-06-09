// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, TOGGLE_DRAWING, ADD_SCENE_AT, ADD_SCENE, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';
import type { ADD_SCENE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION, APPEND_STROKE_ACTION, ADD_SCENE_AT_ACTION } from 'src/client/app/actionTypeDefinitions';

export function appendPoint(x: number, y: number, timeStamp: number): APPEND_POINT_ACTION {
	return { type: APPEND_POINT, x, y, timeStamp, sceneIndex: NaN };
}

export function createStroke(x: number, y: number, timeStamp: number): APPEND_STROKE_ACTION {
	return { type: APPEND_STROKE, x, y, timeStamp, sceneIndex: NaN };
}

export function finishStroke(x: number, y: number, timeStamp: number): FINISH_STROKE_ACTION {
	return { type: FINISH_STROKE, x, y, timeStamp, sceneIndex: NaN };
}

export function toggleDrawing(boolean: boolean) {
	return { type: TOGGLE_DRAWING, boolean };
}

export function addSceneAt(number: number): ADD_SCENE_AT_ACTION {
	return { type: ADD_SCENE_AT, number, sceneIndex: NaN };
}

export const addScene = (): ADD_SCENE_ACTION => ({
	type: ADD_SCENE,
	sceneIndex: NaN,
});

export function nextScene() {
	return { type: NEXT_SCENE };
}

export function previousScene() {
	return { type: PREVIOUS_SCENE };
}
