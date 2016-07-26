import strokes from 'reducers/strokes';
import * as actionTypes from 'constants/actionTypes';
import { THRESHOLD } from 'constants/drawing';
import { last, without } from 'lodash';

let extendedSketch = (sketch, action) => {
	return {
		strokes: strokes(sketch.strokes || [], action)
	}
}

let reduceSketches = (state, action, finished) => {
	let sketchToReduce = last(state) || {};
	let head = without(state, sketchToReduce);
	let tail = extendedSketch(sketchToReduce, action);
	if (finished) {
		tail.finished = true;
	}
	return head.concat([tail])
}

let createStrokeOrSketch = (state, action) => {
	let lastSketch = last(state);
	let lastStroke = lastSketch && last(lastSketch.strokes);
	let lastPoint = lastStroke && last(lastStroke.points);
	if (lastPoint && action.point.timestamp - lastPoint.timestamp <= THRESHOLD) {
		last(state).strokes = strokes(last(state).strokes, action);
	} else {
		state.push({
			strokes: strokes([], action)
		})
	}
	return state;
}

const sketches = (state = [], action) => {
	switch(action.type) {
		case actionTypes.CREATE_STROKE:
			return createStrokeOrSketch(state, action);
		case actionTypes.APPEND_POINT:
			return reduceSketches(state, action);
		case actionTypes.FINISH_STROKE:
			return reduceSketches(state, action, true);
		default:
			return state;
	}
}

export default sketches;