import { TOGGLE_PLOMA, UPDATE_THRESHOLD } from 'constants/actionTypes';

export function togglePloma(bool) {
	return { type: TOGGLE_PLOMA, bool }
}
export function updateThreshold(number) {
	return { type: UPDATE_THRESHOLD, number }
}