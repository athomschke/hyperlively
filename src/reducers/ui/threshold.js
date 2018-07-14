// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { updateThreshold } from 'src/actionCreators';
import { UPDATE_THRESHOLD } from 'src/constants/actionTypes';
import type { UPDATE_THRESHOLD_ACTION } from 'src/actionTypeDefinitions';

const initialThresholdState = () => 500;

export type THRESHOLD_ACTION = UPDATE_THRESHOLD_ACTION;

export const thresholdActions = {
	UPDATE_THRESHOLD: updateThreshold,
};

const threshold = scopeToActions((state: number, action: THRESHOLD_ACTION) => {
	switch (action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}, thresholdActions, initialThresholdState);

export { threshold };
