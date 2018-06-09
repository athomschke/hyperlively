// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { updateThreshold } from 'src/client/app/actions/configuring';
import { UPDATE_THRESHOLD } from 'src/client/app/constants/actionTypes';
import type { UPDATE_THRESHOLD_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialThresholdState = () => 500;

const thresholdActions = [updateThreshold];

const threshold = scopeToActions(
(state: number = initialThresholdState(), action: UPDATE_THRESHOLD_ACTION) => {
	switch (action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}, thresholdActions);

export { threshold };
