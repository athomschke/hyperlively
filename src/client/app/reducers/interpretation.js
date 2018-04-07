// @flow
/* eslint-disable no-param-reassign, consistent-return, default-case */
import produce from 'immer';

import { TOGGLE_INTERPRETER, APPEND_POINT, APPEND_STROKE, RECEIVE_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES } from 'src/client/app/constants/actionTypes';
import { CANDIDATES_COUNT } from 'src/client/app/constants/handwriting';
import { type TOGGLE_INTERPRETER_ACTION, RECOGNIZE_HANDWRITING_ACTION, APPEND_POINT_ACTION, APPEND_STROKE_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type InterpretationState } from 'src/client/app/typeDefinitions';

const initialState = () => ({
	showInterpreter: false,
	interpretations: {
		shapes: [],
		texts: [],
	},
});

type Action = TOGGLE_INTERPRETER_ACTION | RECOGNIZE_HANDWRITING_ACTION |
	APPEND_POINT_ACTION | APPEND_STROKE_ACTION

const interpretation =
(state: InterpretationState = initialState(), action: Action) =>
produce(state, (draftState) => {
	switch (action.type) {
	case TOGGLE_INTERPRETER: {
		draftState.showInterpreter = action.boolean;
		break;
	}
	case RECEIVE_TEXT_CANDIDATES: {
		const candidates = action.candidates.slice(0, CANDIDATES_COUNT);
		if (draftState.interpretations.texts) {
			draftState.interpretations.texts = [
				...draftState.interpretations.texts,
				...candidates,
			];
		} else {
			draftState.interpretations.texts = candidates;
		}
		break;
	}
	case RECEIVE_SHAPE_CANDIDATES: {
		const candidates = action.candidates.slice(0, CANDIDATES_COUNT);
		if (draftState.interpretations.shapes) {
			draftState.interpretations.shapes = [
				...draftState.interpretations.shapes,
				...candidates,
			];
		} else {
			draftState.interpretations.shapes = candidates;
		}
		break;
	}
	case APPEND_POINT:
	case APPEND_STROKE: {
		draftState.interpretations = initialState().interpretations;
		break;
	}
	}
});

export { interpretation };
