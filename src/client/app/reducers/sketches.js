import strokes from 'reducers/strokes';
import * as actionTypes from 'constants/actionTypes';
import { last, without } from 'lodash';

let reduceFirstSketch = (state, action) => {
	return [{
		strokes: strokes([], action),
		position: action.point
	}];
}

let reduceMultipleSketches = (state, action) => {
	let head = without(state, last(state));
	let tail = {
		strokes: strokes(last(state).strokes, action),
		position: last(state).position || action.point
	}
	return head.concat([tail])
}

let reduceSketches = (state, action) => {
	return state.length > 0 ? reduceMultipleSketches(state, action) :
		reduceFirstSketch(state, action);
}

const sketches = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.FINISH_STROKE:
			return reduceSketches(state, action);
		case actionTypes.CREATE_STROKE:
			return reduceSketches(state, action);
		default:
			return state;
	}
}

export default sketches;