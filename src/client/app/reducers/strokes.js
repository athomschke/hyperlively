import { points } from 'reducers/points';
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, SELECT, SELECT_INSIDE } from 'constants/actionTypes';
import { last, forEach, concat, find, map, isEqual, without, flatten } from 'lodash';
import { appendPoint as appendPointAction } from 'actions/drawing';
import Polygon from 'polygon';

const appendPoint = (state, action) => {
	if (state.length > 0) {
		last(state).points = points(last(state).points, appendPointAction(action.x, action.y, action.timeStamp));
		return state;
	} else {
		return appendStroke(state, action);
	}
};

const appendStroke = (state, action) => {
	return concat(state, [{
		actionIndex: action.index,
		points: points([], appendPointAction(action.x, action.y, action.timeStamp)),
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
	return state;
};

const finishStroke = (state, action) => {
	let nextState = appendPoint(state, action);
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
	return state;
};

const select = (state, strokes) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(strokes, stateStroke)) {
			stateStroke.selected = true;
		} else {
			delete stateStroke.selected;
		}
	});
	return state;
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
	return state;
};

function strokes (state = [], action) {
	switch(action.type) {
	case APPEND_POINT:
		return appendPoint(state, action);
	case APPEND_STROKE:
		return appendStroke(state, action);
	case FINISH_STROKE:
		return finishStroke(state, action);
	case UPDATE_POSITION:
		return updatePosition(state, action);
	case HIDE:
		return hide(state, action);
	case SELECT:
		return select(state, action.strokes);
	case SELECT_INSIDE:
		return selectInside(state, action);
	default:
		return state;
	}
}

export { strokes };