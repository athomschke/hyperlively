// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, TOGGLE_DRAWING, ADD_SCENE_AT, ADD_SCENE, NEXT_SCENE, PREVIOUS_SCENE } from 'src/client/app/constants/actionTypes';

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

export function addScene() {
	return { type: ADD_SCENE };
}

export function nextScene() {
	return { type: NEXT_SCENE };
}

export function previousScene() {
	return { type: PREVIOUS_SCENE };
}
