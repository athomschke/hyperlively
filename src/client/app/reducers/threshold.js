// @flow
import { UPDATE_THRESHOLD } from 'constants/actionTypes';
import { defaultThreshold } from './defaultState';
import { type UPDATE_THRESHOLD_ACTION } from '../actionTypeDefinitions';

function threshold(state: number = defaultThreshold, action: UPDATE_THRESHOLD_ACTION) {
	switch (action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}

export { threshold };
