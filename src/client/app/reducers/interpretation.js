// @flow
import { TOGGLE_INTERPRETER, APPEND_POINT, APPEND_STROKE, RECEIVE_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES } from 'constants/actionTypes';
import { type TOGGLE_INTERPRETER_ACTION, RECOGNIZE_HANDWRITING_ACTION, APPEND_POINT_ACTION, APPEND_STROKE_ACTION } from '../actionTypeDefinitions';
import { type InterpretationState } from '../typeDefinitions';

const initialState = () => ({
	showInterpreter: false,
	interpretations: {
		shape: null,
		text: null,
	},
});

function interpretation(
		state: InterpretationState = initialState(),
		action: TOGGLE_INTERPRETER_ACTION | RECOGNIZE_HANDWRITING_ACTION |
			APPEND_POINT_ACTION | APPEND_STROKE_ACTION) {
	switch (action.type) {
	case TOGGLE_INTERPRETER: {
		return Object.assign({}, state, {
			showInterpreter: action.boolean,
		});
	}
	case RECEIVE_TEXT_CANDIDATES: {
		return Object.assign({}, state, {
			interpretations: Object.assign({}, state.interpretations, {
				text: action.candidates[0],
			}),
		});
	}
	case RECEIVE_SHAPE_CANDIDATES: {
		return Object.assign({}, state, {
			interpretations: Object.assign({}, state.interpretations, {
				shape: action.candidates[0],
			}),
		});
	}
	case APPEND_POINT:
	case APPEND_STROKE: {
		return Object.assign({}, state, {
			interpretations: initialState().interpretations,
		});
	}
	default: {
		return state;
	}
	}
}

export { interpretation };
