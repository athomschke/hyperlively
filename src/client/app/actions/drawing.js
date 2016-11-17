import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, TOGGLE_DRAWING, ADD_SCENE_AT, ADD_SCENE } from 'constants/actionTypes';

export function appendPoint(x, y, timeStamp, sceneIndex) {
	return { type: APPEND_POINT, x, y, timeStamp, sceneIndex };
}

export function createStroke(x, y, timeStamp, sceneIndex) {
	return { type: CREATE_STROKE, x, y, timeStamp, sceneIndex };
}

export function finishStroke(x, y, timeStamp, sceneIndex) {
	return { type: FINISH_STROKE, x, y, timeStamp, sceneIndex };
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