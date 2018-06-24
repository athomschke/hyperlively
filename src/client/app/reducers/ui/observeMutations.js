// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { setObserveMutations } from 'src/client/app/actionCreators';
import { OBSERVE_MUTATIONS } from 'src/client/app/constants/actionTypes';
import { type OBSERVE_MUTATIONS_ACTION } from 'src/client/app/actionTypeDefinitions';

const initialObserveMutationsState = () => true;

const observeMutationsActions = {
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