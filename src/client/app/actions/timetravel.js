import * as actionTypes from 'constants/actionTypes';

export function jumpTo(pointInTime) {
	return { type: actionTypes.JUMP_TO, pointInTime }
}