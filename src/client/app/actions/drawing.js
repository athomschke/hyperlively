import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE } from 'constants/actionTypes';

export function appendPoint(event) {
	return { type: APPEND_POINT, event }
}

export function createStroke(event) {
	return { type: CREATE_STROKE, event }
}

export function finishStroke(event) {
	return { type: FINISH_STROKE, event }
}
