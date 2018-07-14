// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { toggleInterpreter } from 'src/actionCreators';
import { TOGGLE_INTERPRETER } from 'src/constants/actionTypes';
import { type TOGGLE_INTERPRETER_ACTION } from 'src/actionTypeDefinitions';

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
