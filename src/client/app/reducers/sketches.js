import strokes from 'reducers/strokes';
import * as actionTypes from 'constants/actionTypes';
import { last, without } from 'lodash';

let reduceFirstSketch = (state, action) => {
	return [{
		strokes: strokes([], action)
	}];
}

let reduceMultipleSketches = (state, action) => {
	let head = without(state, last(state));
	let tail = {
		strokes: strokes(last(state).strokes, action)
	}
	return head.concat([tail])
}

const sketches = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.FINISH_STROKE:
			return state.length > 0 ? reduceMultipleSketches(state, action) :
				reduceFirstSketch(state, action);
			reduceMultipleSketches();
		case actionTypes.CREATE_STROKE:
			return reduceMultipleSketches(state.concat({
				strokes: strokes([], action)
			}), action)
		default:
			return state;
	}
}

export default sketches;