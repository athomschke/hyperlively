// @flow
import { values } from 'lodash';

import {
	CHOOSE_FUNCTIONS,
	CHOOSE_PARAMETERS,
	STORE_INTERPRETATION,
	RECEIVE_SHAPE_CANDIDATES,
	RECEIVE_TEXT_CANDIDATES,
} from 'src/constants/actionTypes';
import type {
	CHOOSE_FUNCTIONS_ACTION,
	CHOOSE_PARAMETERS_ACTION,
	STORE_INTERPRETATION_ACTION,
	RECEIVE_SHAPE_CANDIDATES_ACTION,
	RECEIVE_TEXT_CANDIDATES_ACTION,
} from 'src/actionTypeDefinitions';
import {
	chooseFunctions,
	chooseParameters,
	storeInterpretation,
	receiveShapeCandidates,
	receiveTextCandidates,
} from 'src/actionCreators';
import type { InterpretationsState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';
import { formattedSignatures, allActions } from 'src/containers/ActionChooser/actionSignatures';

export type INTERPRETATIONS_ACTION = CHOOSE_FUNCTIONS_ACTION | CHOOSE_PARAMETERS_ACTION |
	STORE_INTERPRETATION_ACTION |
	RECEIVE_SHAPE_CANDIDATES_ACTION | RECEIVE_TEXT_CANDIDATES_ACTION;

export const interpretationsActions = {
	STORE_INTERPRETATION: storeInterpretation,
	CHOOSE_FUNCTIONS: chooseFunctions,
	CHOOSE_PARAMETERS: chooseParameters,
	RECEIVE_SHAPE_CANDIDATES: receiveShapeCandidates,
	RECEIVE_TEXT_CANDIDATES: receiveTextCandidates,
};

const initialInterpretationsState = () => ({
	stored: {},
	functions: [],
	parameters: [],
});

const stateAfterReceive = (state: InterpretationsState, action: any) => {
	const recognizedStoredLabel = Object
		.keys(state.stored)
		.find(candidateLabel => action.candidates.find(candidate => candidate.label === candidateLabel));
	// const knownCandidate = action.candidates.find(candidate => Object.keys(state.stored).indexOf(candidate.label) >= 0);
	if (recognizedStoredLabel) {
		const recognizedActions = state.stored[recognizedStoredLabel];
		const allPrimitiveActions = formattedSignatures(values(allActions([])));
		const functions = (allPrimitiveActions.filter(
			primitiveAction => recognizedActions.find(recognizedAction => recognizedAction === primitiveAction.name),
		) || []);
		return {
			...state,
			functions,
		};
	}
	return state;
};

const interpretations = scopeToActions(
	(state: InterpretationsState, action: INTERPRETATIONS_ACTION) => {
		if (action.type === RECEIVE_SHAPE_CANDIDATES) {
			return stateAfterReceive(state, action);
		}
		if (action.type === RECEIVE_TEXT_CANDIDATES) {
			return stateAfterReceive(state, action);
		}

		if (action.type === CHOOSE_FUNCTIONS) {
			return {
				...state,
				functions: action.functions,
			};
		}
		if (action.type === CHOOSE_PARAMETERS) {
			return {
				...state,
				parameters: action.parameters,
			};
		}
		if (action.type === STORE_INTERPRETATION) {
			return {
				...state,
				stored: {
					...state.stored,
					[action.label]: action.actions,
				},
			};
		}
		return state;
	}, interpretationsActions, initialInterpretationsState,
);

export { interpretations };
