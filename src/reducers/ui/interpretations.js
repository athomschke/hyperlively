// @flow
import { values } from 'lodash';

import {
	CHOOSE_FUNCTIONS,
	CHOOSE_PARAMETERS,
	STORE_INTERPRETATION,
	RECEIVE_SHAPE_CANDIDATES,
	RECEIVE_TEXT_CANDIDATES,
	SELECT,
} from 'src/constants/actionTypes';
import type {
	CHOOSE_FUNCTIONS_ACTION,
	CHOOSE_PARAMETERS_ACTION,
	STORE_INTERPRETATION_ACTION,
	RECEIVE_SHAPE_CANDIDATES_ACTION,
	RECEIVE_TEXT_CANDIDATES_ACTION,
	SELECT_ACTION,
} from 'src/actionTypeDefinitions';
import {
	chooseFunctions,
	chooseParameters,
	storeInterpretation,
	receiveShapeCandidates,
	receiveTextCandidates,
	select,
} from 'src/actionCreators';
import type { InterpretationsState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';
import { formattedSignatures, allActions } from 'src/containers/ActionChooser/actionSignatures';

export type INTERPRETATIONS_ACTION = CHOOSE_FUNCTIONS_ACTION | CHOOSE_PARAMETERS_ACTION |
	STORE_INTERPRETATION_ACTION |
	RECEIVE_SHAPE_CANDIDATES_ACTION | RECEIVE_TEXT_CANDIDATES_ACTION | SELECT_ACTION;

export const interpretationsActions = {
	STORE_INTERPRETATION: storeInterpretation,
	CHOOSE_FUNCTIONS: chooseFunctions,
	CHOOSE_PARAMETERS: chooseParameters,
	RECEIVE_SHAPE_CANDIDATES: receiveShapeCandidates,
	RECEIVE_TEXT_CANDIDATES: receiveTextCandidates,
	SELECT: select,
};

const initialInterpretationsState = () => ({
	stored: {},
	functions: [],
	parameters: [],
	selectedStrokeIds: null,
});

const stateAfterReceive = (state: InterpretationsState, action: any) => {
	if (state.selectedStrokeIds === action.strokeIds.toString()) {
		const routineNames = Object.keys(state.stored);
		const candidatesWithSomeStoredRoutine = action.candidates.filter(candidate => routineNames.indexOf(candidate.label) >= 0);
		const candidatesByLikeliness = candidatesWithSomeStoredRoutine.sort((a, b) => a.resemblanceScore <= b.resemblanceScore);
		const recognizedStoredLabel = candidatesByLikeliness.length > 0 && candidatesByLikeliness[0].label;
		if (recognizedStoredLabel) {
			const recognizedActions = state.stored[recognizedStoredLabel].actions;
			const allPrimitiveActions = formattedSignatures(values(allActions([])));
			const functions = recognizedActions.map(
				recognizedAction => allPrimitiveActions.find(primitiveAction => primitiveAction.name === recognizedAction),
			);
			return {
				...state,
				functions,
				parameters: state.stored[recognizedStoredLabel].parameters.map((parameter) => {
					if (parameter.value && parameter.value.startsWith && (parameter: any).value.startsWith('strokes: ')) {
						// eslint-disable-next-line no-param-reassign
						(parameter: any).value = `strokes: ${action.strokeIds.join(', ')}`;
					}
					return parameter;
				}),
			};
		}
	}
	return state;
};

const interpretations = scopeToActions(
	(state: InterpretationsState, action: INTERPRETATIONS_ACTION) => {
		if (action.type === SELECT) {
			return {
				...state,
				selectedStrokeIds: action.strokes.map(stroke => stroke.id).toString(),
			};
		}
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
					[action.label]: {
						actions: action.actions,
						parameters: action.parameters,
					},
				},
			};
		}
		return state;
	}, interpretationsActions, initialInterpretationsState,
);

export { interpretations };
