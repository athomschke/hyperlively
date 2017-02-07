import { find, map, isEqual, without, flatten } from 'lodash';
import Polygon from 'polygon';

export const updatePosition = (state, action) => {
	let moveByPoint = {
		x: action.target.x - action.origin.x,
		y: action.target.y - action.origin.y
	};
	return map(state, (stateStroke) => {
		if (find(action.strokes, stateStroke)) {
			let newPoints = stateStroke.points.map((point) => {
				let newCoordinates = {
					x: point.x + moveByPoint.x,
					y: point.y + moveByPoint.y
				};
				return Object.assign({}, point, newCoordinates);
			});
			let newStroke = Object.assign({}, stateStroke, {
				points: newPoints
			});
			return newStroke;
		}
		return stateStroke;
	});
};

const doStrokesContainStroke = (strokes, stroke) => {
	return find(map(strokes, 'points'), (points) => {
		return isEqual(points, stroke.points);
	});
};

export const hide = (state, action) => {
	return map(state, (stateStroke) => {
		if (doStrokesContainStroke(action.strokes, stateStroke)) {
			return Object.assign({}, stateStroke, {
				hidden: true
			});
		} else {
			return stateStroke;
		}
	});
};

const selectStrokes = (state, strokes) => {
	return map(state, (stateStroke) => {
		if (doStrokesContainStroke(strokes, stateStroke)) {
			return Object.assign({}, stateStroke, {
				selected: true
			});
		} else if (stateStroke.selected) {
			let newStroke = Object.assign({}, stateStroke);
			delete newStroke.selected;
			return newStroke;
		} else {
			return stateStroke;
		}
	});
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