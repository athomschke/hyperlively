import { JUMP_TO } from 'constants/actionTypes';

export function jumpTo(pointInTime) {
	return { type: JUMP_TO, pointInTime };
}