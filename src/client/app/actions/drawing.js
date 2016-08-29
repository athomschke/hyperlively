import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, TOGGLE_DRAWING } from 'constants/actionTypes';

export function appendPoint(event) {
	return { type: APPEND_POINT, event };
}

export function createStroke(event) {
	return { type: CREATE_STROKE, event };
}

export function finishStroke(event) {
	return { type: FINISH_STROKE, event };
}

export function toggleDrawing(bool) {
	return { type: TOGGLE_DRAWING, bool };
}
