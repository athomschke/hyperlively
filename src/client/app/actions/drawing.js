import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, TOGGLE_DRAWING } from 'constants/actionTypes';

export function appendPoint(event, sceneIndex) {
	return { type: APPEND_POINT, event, sceneIndex };
}

export function createStroke(event, sceneIndex) {
	return { type: CREATE_STROKE, event, sceneIndex };
}

export function finishStroke(event, sceneIndex) {
	return { type: FINISH_STROKE, event, sceneIndex };
}

export function toggleDrawing(bool) {
	return { type: TOGGLE_DRAWING, bool };
}
