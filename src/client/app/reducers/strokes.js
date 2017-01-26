import { points } from 'reducers/points';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, SELECT } from 'constants/actionTypes';
import { last, forEach, concat, find, map, isEqual } from 'lodash';
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

const doStrokesContainStroke = (strokes, stroke) => {
	return find(map(strokes, 'points'), (points) => {
		return isEqual(points, stroke.points);
	});
};

const hide = (state, action) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(action.strokes, stateStroke)) {
			stateStroke.hidden = true;
		}
	});
};


const select = (state, action) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(action.strokes, stateStroke)) {
			stateStroke.selected = true;
		} else {
			delete stateStroke.selected;
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
	case UPDATE_POSITION:
		moveBy(state, action);
		return state;
	case HIDE:
		hide(state, action);
		return state;
	case SELECT:
		select(state, action);
		return state;
	default:
		return state;
	}
}

export { strokes };