import strokes from 'reducers/strokes';
import * as actionTypes from 'constants/actionTypes';
import { last, without } from 'lodash';

const sketches = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
		case actionTypes.FINISH_STROKE:
			if (state.length > 1) {
				let head = without(state, last(state));
				let tail = {
					strokes: strokes(last(state).strokes, action)
				}
				return head.concat([tail])
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