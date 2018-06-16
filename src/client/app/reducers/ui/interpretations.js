// @flow
import { CHOOSE_FUNCTIONS, CHOOSE_PARAMETERS } from 'src/client/app/constants/actionTypes';
import type { CHOOSE_FUNCTIONS_ACTION, CHOOSE_PARAMETERS_ACTION } from 'src/client/app/actionTypeDefinitions';
import { chooseFunctions, chooseParameters } from 'src/client/app/actionCreators';
import type { InterpretationsState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

const chooseFunctionsActions = {
	CHOOSE_FUNCTIONS: chooseFunctions,
};

const functions = scopeToActions((state, action: CHOOSE_FUNCTIONS_ACTION) => {
	if (action.type === CHOOSE_FUNCTIONS) {
		return action.functions;
	}
	return state;
}, chooseFunctionsActions, () => []);

const chooseParametersActions = {
	CHOOSE_PARAMETERS: chooseParameters,
};

const parameters = scopeToActions((state, action: CHOOSE_PARAMETERS_ACTION) => {
	if (action.type === CHOOSE_PARAMETERS) {
		return action.parameters;
	}
	return state;
}, chooseParametersActions, () => []);

export type INTERPRETATIONS_ACTION = CHOOSE_FUNCTIONS_ACTION | CHOOSE_PARAMETERS_ACTION;

export const interpretationsActions = {
	...chooseFunctionsActions,
	...chooseParametersActions,
};

const initialInterpretationsState = () => ({
	functions: functions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
});

const interpretations = scopeToActions(
	(state: InterpretationsState, action: INTERPRETATIONS_ACTION) => ({
		functions: functions(state.functions, action),
		parameters: parameters(state.parameters, action),
	}), interpretationsActions, initialInterpretationsState);

export { interpretations };
