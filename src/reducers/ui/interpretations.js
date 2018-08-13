// @flow
import { CHOOSE_FUNCTIONS, CHOOSE_PARAMETERS, STORE_INTERPRETATION } from 'src/constants/actionTypes';
import type { CHOOSE_FUNCTIONS_ACTION, CHOOSE_PARAMETERS_ACTION, STORE_INTERPRETATION_ACTION } from 'src/actionTypeDefinitions';
import { chooseFunctions, chooseParameters, storeInterpretation } from 'src/actionCreators';
import type { InterpretationsState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

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

const storeInterpretationActions = {
	STORE_INTERPRETATION: storeInterpretation,
};

const stored = scopeToActions((state, action: STORE_INTERPRETATION_ACTION) => {
	if (action.type === STORE_INTERPRETATION) {
		return {
			...state,
			[action.label]: action.actions,
		};
	}
	return state;
}, storeInterpretationActions, () => ({}));

export type INTERPRETATIONS_ACTION = CHOOSE_FUNCTIONS_ACTION | CHOOSE_PARAMETERS_ACTION | STORE_INTERPRETATION_ACTION;

export const interpretationsActions = {
	...storeInterpretationActions,
	...chooseFunctionsActions,
	...chooseParametersActions,
};

const initialInterpretationsState = () => ({
	stored: stored(undefined, { type: '' }),
	functions: functions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
});

const interpretations = scopeToActions(
	(state: InterpretationsState, action: INTERPRETATIONS_ACTION) => ({
		stored: stored(state.stored, action),
		functions: functions(state.functions, action),
		parameters: parameters(state.parameters, action),
	}), interpretationsActions, initialInterpretationsState,
);

export { interpretations };
