// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, TOGGLE_DRAWING, ADD_SCENE_AT, ADD_SCENE, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';
import { type ADD_SCENE_ACTION } from 'src/client/app/actionTypeDefinitions';

export function appendPoint(x: number, y: number, timeStamp: number) {
	return { type: APPEND_POINT, x, y, timeStamp };
}

export function createStroke(x: number, y: number, timeStamp: number) {
	return { type: APPEND_STROKE, x, y, timeStamp };
}

export function finishStroke(x: number, y: number, timeStamp: number) {
	return { type: FINISH_STROKE, x, y, timeStamp };
}

export function toggleDrawing(boolean: boolean) {
	return { type: TOGGLE_DRAWING, boolean };
}

export function addSceneAt(number: number) {
	return { type: ADD_SCENE_AT, number };
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
