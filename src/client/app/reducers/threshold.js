// @flow
import { UPDATE_THRESHOLD } from 'constants/actionTypes';
import { defaultThreshold } from './defaultState';

function threshold(state: number = defaultThreshold, action) {
	switch (action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}

export { threshold };
