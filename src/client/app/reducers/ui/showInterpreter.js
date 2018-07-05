// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleInterpreter } from 'src/client/app/actionCreators';
import { TOGGLE_INTERPRETER } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_INTERPRETER_ACTION } from 'src/client/app/actionTypeDefinitions';

const initialShowInterpreterState = () => true;

export const showInterpreterActions = {
	TOGGLE_INTERPRETER: toggleInterpreter,
};

const showInterpreter = scopeToActions((state: boolean, action: TOGGLE_INTERPRETER_ACTION) => {
	switch (action.type) {
	case TOGGLE_INTERPRETER:
		return action.boolean;
	default:
		return state;
	}
}, showInterpreterActions, initialShowInterpreterState);

export { showInterpreter };
