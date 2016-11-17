import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, TOGGLE_DRAWING, ADD_SCENE_AT, ADD_SCENE, NEXT_SCENE } from 'constants/actionTypes';

export function appendPoint(x, y, timeStamp) {
	return { type: APPEND_POINT, x, y, timeStamp };
}

export function createStroke(x, y, timeStamp) {
	return { type: CREATE_STROKE, x, y, timeStamp };
}

export function finishStroke(x, y, timeStamp) {
	return { type: FINISH_STROKE, x, y, timeStamp };
}

export function toggleDrawing(bool) {
	return { type: TOGGLE_DRAWING, bool };
}

export function addSceneAt(index) {
	return { type: ADD_SCENE_AT, index };
}

export function addScene() {
	return { type: ADD_SCENE };
}

export function nextScene() {
	return { type: NEXT_SCENE };
}