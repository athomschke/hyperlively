import { forEach, find, map, isEqual, without, flatten } from 'lodash';
import Polygon from 'polygon';

export const updatePosition = (state, action) => {
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

const doStrokesContainStroke = (strokes, stroke) => {
	return find(map(strokes, 'points'), (points) => {
		return isEqual(points, stroke.points);
	});
};

export const hide = (state, action) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(action.strokes, stateStroke)) {
			stateStroke.hidden = true;
		}
	});
	return state;
};

const selectStrokes = (state, strokes) => {
	forEach(state, (stateStroke) => {
		if (doStrokesContainStroke(strokes, stateStroke)) {
			stateStroke.selected = true;
		} else {
			delete stateStroke.selected;
		}
	});
	return state;
};

export const select = (state, action) => {
	return selectStrokes(state, action.strokes);
};

export const selectInside = (state, action) => {
	let outerPolygon = new Polygon(flatten(map(action.strokes, 'points')));
	let innerStrokes = without(state, action.strokes).filter((innerStroke) => {
		if (!innerStroke.hidden) {
			let innerPolygon = new Polygon(innerStroke.points);
			return outerPolygon.containsPolygon(innerPolygon);
		}
	});
	return selectStrokes(state, innerStrokes);
};