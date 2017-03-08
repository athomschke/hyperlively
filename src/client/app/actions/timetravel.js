// @flow
import { JUMP_TO } from 'constants/actionTypes';

export function jumpTo(pointInTime: number, sceneIndex: number) {
	return { type: JUMP_TO, pointInTime, sceneIndex };
}
