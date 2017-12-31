// @flow
import { OBSERVE_MUTATIONS } from 'src/client/app/constants/actionTypes';
import { type OBSERVE_MUTATIONS_ACTION } from 'src/client/app/actionTypeDefinitions';

function observeMutations(state: boolean = true, action: OBSERVE_MUTATIONS_ACTION) {
	switch (action.type) {
	case OBSERVE_MUTATIONS:
		return action.boolean;
	default:
		return state;
	}
}

export { observeMutations };
