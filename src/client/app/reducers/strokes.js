import { points } from 'reducers/points';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'constants/actionTypes';
import { last, forEach, concat, find, map, isEqual, without, flatten } from 'lodash';
import { appendPoint } from 'actions/drawing';
import Polygon from 'polygon';

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

const updatePosition = (state, action) => {
	let moveByPoint = {
		x: action.target.x - action.origin.x,
		y: action.target.y - action.origin.y
	};
	forEach(state, (stateStroke) => {
		if (find(action.strokes, stateStroke)) {
			forEach(stateStroke.points, (point) => {
				point.x += moveByPoint.x;
				point.y += moveByPoint.y;
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

const select = (state, strokes) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(strokes, stateStroke)) {
			stateStroke.selected = true;
		} else {
			delete stateStroke.selected;
		}
	});
};

const strokesSurroundedBy = (allStrokes, surroundingStrokes) => {
	let outerPolygon = new Polygon(flatten(map(surroundingStrokes, 'points')));
	return without(allStrokes, surroundingStrokes).filter((innerStroke) => {
		if (!innerStroke.hidden) {
			let innerPolygon = new Polygon(innerStroke.points);
			return outerPolygon.containsPolygon(innerPolygon);
		}
	});
};

const selectInside = (state, action) => {
	select(state, strokesSurroundedBy(state, action.strokes));
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
		updatePosition(state, action);
		return state;
	case HIDE:
		hide(state, action);
		return state;
	case SELECT:
		select(state, action.strokes);
		return state;
	case SELECT_INSIDE:
		selectInside(state, action);
		return state;
	default:
		return state;
	}
}

export { strokes };