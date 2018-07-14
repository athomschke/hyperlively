// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { setObserveMutations } from 'src/actionCreators';
import { OBSERVE_MUTATIONS } from 'src/constants/actionTypes';
import { type OBSERVE_MUTATIONS_ACTION } from 'src/actionTypeDefinitions';

const initialObserveMutationsState = () => true;

export const observeMutationsActions = {
	OBSERVE_MUTATIONS: setObserveMutations,
};

const observeMutations = scopeToActions((state: boolean, action: OBSERVE_MUTATIONS_ACTION) => {
	switch (action.type) {
	case OBSERVE_MUTATIONS:
		return action.boolean;
	default:
		return state;
	}
}, observeMutationsActions, initialObserveMutationsState);

export { observeMutations };
