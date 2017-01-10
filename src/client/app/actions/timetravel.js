import { JUMP_TO } from 'constants/actionTypes';

export function jumpTo(pointInTime, sceneIndex) {
	return { type: JUMP_TO, pointInTime, sceneIndex };
}