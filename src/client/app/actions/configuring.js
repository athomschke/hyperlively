import { TOGGLE_PLOMA, UPDATE_THRESHOLD, TOGGLE_HANDWRITING_RECOGNITION, OBSERVE_MUTATIONS } from 'constants/actionTypes';

export function togglePloma(bool) {
	return { type: TOGGLE_PLOMA, bool };
}

export function observeMutations(bool) {
	return { type: OBSERVE_MUTATIONS, bool };
}

export function updateThreshold(number) {
	return { type: UPDATE_THRESHOLD, number };
}

export function toggleHandwritingRecognition(bool) {
	return { type: TOGGLE_HANDWRITING_RECOGNITION, bool };
}