import { last } from 'lodash';
import { points } from 'reducers/points';
import { appendPoint as appendPointAction } from 'actions/drawing';

export const appendPoint = (state, action) => {
	if (state.length > 0) {
		last(state).points = points(last(state).points, appendPointAction(action.x, action.y, action.timeStamp));
		return state;
	} else {
		return appendStroke(state, action);
	}
};

export const appendStroke = (state, action) => {
	return state.concat([{
		actionIndex: action.index,
		points: points([], appendPointAction(action.x, action.y, action.timeStamp)),
		position: {
			x: action.x,
			y: action.y
		}
	}]);
};

export const finishStroke = (state, action) => {
	let nextState = appendPoint(state, action);
	last(nextState).finished = true;
	return nextState; 
};