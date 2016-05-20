import strokes from 'reducers/strokes';
import * as actionTypes from 'constants/actionTypes';
import { combineReducers } from 'redux';
import { last, without } from 'lodash';

const sketches = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
			if (state.length > 1) {
				let head = without(state, last(state));
				let tail = {
					strokes: strokes(last(state).strokes, action)
				}
				return [
					...head,
					tail
				]
			} else if (state.length > 0) {
				return [{
					strokes: strokes(last(state).strokes, action)
				}]
			} else {
				return [{
					strokes: strokes([], action)
				}];
			}
		default:
			return state;
	}
}

export default sketches;