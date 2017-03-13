// @flow
import { OBSERVE_MUTATIONS } from 'constants/actionTypes';
import { type OBSERVE_MUTATIONS_ACTION } from '../actionTypeDefinitions';

function observeMutations(state: boolean = true, action: OBSERVE_MUTATIONS_ACTION) {
	switch (action.type) {
	case OBSERVE_MUTATIONS:
		return action.boolean;
	default:
		return state;
	}
}

export { observeMutations };
