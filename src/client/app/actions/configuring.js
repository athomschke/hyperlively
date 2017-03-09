// @flow
import { TOGGLE_PLOMA, UPDATE_THRESHOLD, TOGGLE_HANDWRITING_RECOGNITION, OBSERVE_MUTATIONS, SET_SCENE_INDEX, JUMP_TO } from 'constants/actionTypes';

export function togglePloma(bool: boolean) {
	return { type: TOGGLE_PLOMA, bool };
}

export function updateThreshold(number: number) {
	return { type: UPDATE_THRESHOLD, number };
}

export function toggleHandwritingRecognition(bool: boolean) {
	return { type: TOGGLE_HANDWRITING_RECOGNITION, bool };
}

export function setObserveMutations(bool: boolean) {
	return { type: OBSERVE_MUTATIONS, bool };
}

export function setSceneIndex(index: number) {
	return { type: SET_SCENE_INDEX, index };
}

export function jumpTo(pointInTime: number, sceneIndex: number) {
	return { type: JUMP_TO, pointInTime, sceneIndex };
}
