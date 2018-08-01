// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import {
	toggleInterpreter, receiveTextCandidates, receiveShapeCandidates, clearRecognitionResults,
} from 'src/actionCreators';
import {
	RECEIVE_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES, CLEAR_RECOGNITION_RESULTS,
} from 'src/constants/actionTypes';
import { CANDIDATES_COUNT } from 'src/constants/handwriting';
import type {
	TOGGLE_INTERPRETER_ACTION,
	RECEIVE_TEXT_CANDIDATES_ACTION,
	RECEIVE_SHAPE_CANDIDATES_ACTION,
	CLEAR_RECOGNITION_RESULTS_ACTION,
} from 'src/actionTypeDefinitions';
import type {
	ShapeCandidateState, RecognitionState, TextCandidateState, TextCandidate, ShapeCandidate,
} from 'src/types';

const initialInterpretationState = (): RecognitionState => ({
	shapes: [],
	texts: [],
});

export const interpretationActions = {
	TOGGLE_INTERPRETER: toggleInterpreter,
	RECEIVE_TEXT_CANDIDATES: receiveTextCandidates,
	RECEIVE_SHAPE_CANDIDATES: receiveShapeCandidates,
	CLEAR_RECOGNITION_RESULTS: clearRecognitionResults,
};

export type INTERPRETATION_ACTION = TOGGLE_INTERPRETER_ACTION | RECEIVE_TEXT_CANDIDATES_ACTION |
RECEIVE_SHAPE_CANDIDATES_ACTION | CLEAR_RECOGNITION_RESULTS_ACTION

type InterpretationReducer = (state: RecognitionState, aciton: INTERPRETATION_ACTION) =>
	RecognitionState;

type TextResultToState = (candidates: Array<TextCandidate>, strokeIds: number[]) =>
Array<TextCandidateState>
type ShapeResultToState = (candidates: Array<ShapeCandidate>, strokeIds: number[]) =>
Array<ShapeCandidateState>

const resultToState = (candidates, strokeIds) => candidates
	.slice(0, CANDIDATES_COUNT)
	.map(candidate => ({ candidate, strokeIds }));

const textCandidates = (state: RecognitionState, action: RECEIVE_TEXT_CANDIDATES_ACTION) => ({
	...state,
	texts: [
		...state.texts,
		...((resultToState:any):TextResultToState)(action.candidates, action.strokeIds),
	],
});

const shapeCandidates = (state: RecognitionState, action: RECEIVE_SHAPE_CANDIDATES_ACTION) => ({
	...state,
	shapes: [
		...state.shapes,
		...((resultToState:any):ShapeResultToState)(action.candidates, action.strokeIds),
	],
});

const scopedInterpretation: InterpretationReducer = (state, action) => {
	switch (action.type) {
	case RECEIVE_TEXT_CANDIDATES: return textCandidates(state, action);
	case RECEIVE_SHAPE_CANDIDATES: return shapeCandidates(state, action);
	case CLEAR_RECOGNITION_RESULTS:
		return initialInterpretationState();
	default:
		return state;
	}
};

const interpretation = scopeToActions(scopedInterpretation, interpretationActions, initialInterpretationState);

export { interpretation };
