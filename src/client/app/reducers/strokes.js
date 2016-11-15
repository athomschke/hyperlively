import { points } from 'reducers/points';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_BOUNDS, HIDE } from 'constants/actionTypes';
import { last, forEach, concat, find } from 'lodash';
import { appendPoint } from 'actions/drawing';

const appendPointTo = (state, action) => {
	if (state.length > 0) {
		last(state).points = points(last(state).points, appendPoint(action.x, action.y, action.timeStamp));
		return state;
	} else {
		return appendStrokeTo(state, action);
	}
};

const appendStrokeTo = (state, action) => {
	return concat(state, [{
		actionIndex: action.index,
		points: points([], appendPoint(action.x, action.y, action.timeStamp)),
		position: {
			x: action.x,
			y: action.y
		}
	}]);
};

const moveBy = (state, action) => {
	forEach(state, (stateStroke) => {
		if (find(action.strokes, stateStroke)) {
			forEach(stateStroke.points, (point) => {
				point.x += action.x;
				point.y += action.y;
			});			
		}
	});
};

const finishStroke = (state, action) => {
	let nextState = appendPointTo(state, action);
	last(nextState).finished = true;
	return nextState; 
};

const hide = (state, action) => {
	forEach(state, (stateStroke) => {
		if (find(action.strokes, stateStroke)) {
			stateStroke.hidden = true;			
		}
	});
};

function strokes (state = [], action) {
	switch(action.type) {
	case APPEND_POINT:
		return appendPointTo(state, action);
	case CREATE_STROKE:
		return appendStrokeTo(state, action);
	case FINISH_STROKE:
		return finishStroke(state, action);
	case UPDATE_BOUNDS:
		moveBy(state, action);
		return state;
	case HIDE:
		hide(state, action);
		return state;
	default:
		return state;
	}
}

export { strokes };