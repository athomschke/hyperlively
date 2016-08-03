import * as actionTypes from 'constants/actionTypes';

export function appendPoint(event) {
	return { type: actionTypes.APPEND_POINT, event }
}

export function createStroke(event) {
	return { type: actionTypes.CREATE_STROKE, event }
}

export function finishStroke(event) {
	return { type: actionTypes.FINISH_STROKE, event }
}
