import * as actionTypes from 'constants/actionTypes';
import { without, last, concat, filter } from 'lodash';
import undoable, { distinctState } from 'redux-undo';

const strokes = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
			if (state.length > 0) {
				return [
					...without(state, last(state)),
					concat(last(state), [action.point])
				];
			} else {
				return state;
			}
		case actionTypes.CREATE_STROKE:
			return [
				...state,
				[action.point]
			]
		default:
			return state;
	}
}

const undoableStrokes = undoable(strokes, {
})

export default undoableStrokes;