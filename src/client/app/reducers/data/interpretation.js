// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleInterpreter, appendPoint, createStroke, receiveTextCandidates, receiveShapeCandidates } from 'src/client/app/actionCreators';
import { APPEND_POINT, APPEND_STROKE, RECEIVE_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES } from 'src/client/app/constants/actionTypes';
import { CANDIDATES_COUNT } from 'src/client/app/constants/handwriting';
import type { TOGGLE_INTERPRETER_ACTION, RECEIVE_TEXT_CANDIDATES_ACTION, RECEIVE_SHAPE_CANDIDATES_ACTION, APPEND_POINT_ACTION, APPEND_STROKE_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type RecognitionResult } from 'src/client/app/types';

const initialInterpretationState = (): RecognitionResult => ({
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

const interpretation = scopeToActions((state: RecognitionResult, action: INTERPRETATION_ACTION) => {
	switch (action.type) {
	case RECEIVE_TEXT_CANDIDATES:
		return {
			...state,
			texts: [
				...state.texts,
				...action.candidates.slice(0, CANDIDATES_COUNT),
			],
		};
	case RECEIVE_SHAPE_CANDIDATES:
		return {
			...state,
			shapes: [
				...state.shapes,
				...action.candidates.slice(0, CANDIDATES_COUNT),
			],
		};
	case APPEND_POINT:
	case APPEND_STROKE:
		return initialInterpretationState();
	default:
		return state;
	}
}, interpretationActions, initialInterpretationState);

export { interpretation };
