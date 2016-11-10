import { OBSERVE_MUTATIONS } from 'constants/actionTypes';

function observeMutations (state = true, action) {
	switch(action.type) {
	case OBSERVE_MUTATIONS:
		return action.bool;
	default:
		return state;
	}
}

export { observeMutations };