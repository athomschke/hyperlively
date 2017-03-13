// @flow
import { TOGGLE_PLOMA, UPDATE_THRESHOLD, TOGGLE_HANDWRITING_RECOGNITION, OBSERVE_MUTATIONS, SET_SCENE_INDEX, JUMP_TO } from 'constants/actionTypes';

export function togglePloma(boolean: boolean) {
	return { type: TOGGLE_PLOMA, boolean };
}

export function updateThreshold(number: number) {
	return { type: UPDATE_THRESHOLD, number };
}

export function toggleHandwritingRecognition(boolean: boolean) {
	return { type: TOGGLE_HANDWRITING_RECOGNITION, boolean };
}

export function setObserveMutations(boolean: boolean) {
	return { type: OBSERVE_MUTATIONS, boolean };
}

export function setSceneIndex(number: number) {
	return { type: SET_SCENE_INDEX, number };
}

export function jumpTo(pointInTime: number, sceneIndex: number) {
	return { type: JUMP_TO, pointInTime, sceneIndex };
}
