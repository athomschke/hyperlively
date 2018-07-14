// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import {
	toggleInterpreter, appendPoint, createStroke, receiveTextCandidates, receiveShapeCandidates,
} from 'src/actionCreators';
import {
	APPEND_POINT, APPEND_STROKE, RECEIVE_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES,
} from 'src/constants/actionTypes';
import { CANDIDATES_COUNT } from 'src/constants/handwriting';
import type {
	TOGGLE_INTERPRETER_ACTION, RECEIVE_TEXT_CANDIDATES_ACTION, RECEIVE_SHAPE_CANDIDATES_ACTION, APPEND_POINT_ACTION, APPEND_STROKE_ACTION,
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
	APPEND_POINT: appendPoint,
	APPEND_STROKE: createStroke,
};

export type INTERPRETATION_ACTION = TOGGLE_INTERPRETER_ACTION | RECEIVE_TEXT_CANDIDATES_ACTION |
APPEND_POINT_ACTION | APPEND_STROKE_ACTION | RECEIVE_SHAPE_CANDIDATES_ACTION

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
	case APPEND_POINT:
	case APPEND_STROKE:
		return initialInterpretationState();
	default:
		return state;
	}
};

const interpretation = scopeToActions(scopedInterpretation, interpretationActions, initialInterpretationState);

export { interpretation };
