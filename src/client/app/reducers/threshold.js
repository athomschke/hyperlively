// @flow
import { UPDATE_THRESHOLD } from 'src/client/app/constants/actionTypes';
import type { UPDATE_THRESHOLD_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialThresholdState = () => 500;

function threshold(state: number = initialThresholdState(), action: UPDATE_THRESHOLD_ACTION) {
	switch (action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}

export { threshold };
