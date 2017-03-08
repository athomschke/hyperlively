// @flow
import { find, map, isEqual, without, flatten, filter } from 'lodash';
import Polygon from 'polygon';
import { type Stroke } from '../../typeDefinitions';

export const updatePosition = (state: Array<Stroke>, action) => {
	const moveByPoint = {
		x: action.target.x - action.origin.x,
		y: action.target.y - action.origin.y,
	};
	return map(state, (stateStroke) => {
		if (find(action.strokes, stateStroke)) {
			const newPoints = stateStroke.points.map((point) => {
				const newCoordinates = {
					x: point.x + moveByPoint.x,
					y: point.y + moveByPoint.y,
				};
				return Object.assign({}, point, newCoordinates);
			});
			const newStroke = Object.assign({}, stateStroke, {
				points: newPoints,
			});
			return newStroke;
		}
		return stateStroke;
	});
};

const doStrokesContainStroke = (strokes: Array<Stroke>, stroke: Stroke) => {
	const matchingInStrokeProperties = filter(strokes, stateStroke =>
		stateStroke.hidden === stroke.hidden);
	return find(map(matchingInStrokeProperties, 'points'), points =>
		isEqual(points, stroke.points));
};

export const hide = (state: Array<Stroke>, action) =>
	map(state, (stateStroke) => {
		if (doStrokesContainStroke(action.strokes, stateStroke)) {
			return Object.assign({}, stateStroke, {
				hidden: true,
			});
		}
		return stateStroke;
	});

const selectStrokes = (state: Array<Stroke>, strokes: Array<Stroke>) =>
	map(state, (stateStroke) => {
		if (doStrokesContainStroke(strokes, stateStroke)) {
			return Object.assign({}, stateStroke, {
				selected: true,
			});
		} else if (stateStroke.selected) {
			const newStroke = Object.assign({}, stateStroke);
			delete newStroke.selected;
			return newStroke;
		}
		return stateStroke;
	});

export const select = (state: Array<Stroke>, action) => selectStrokes(state, action.strokes);

export const selectInside = (state: Array<Stroke>, action) => {
	const outerPolygon = new Polygon(flatten(map(action.strokes, 'points')));
	const innerStrokes = without(state, action.strokes).filter((innerStroke) => {
		if (innerStroke.hidden) {
			return false;
		}
		const innerPolygon = new Polygon(innerStroke.points);
		return outerPolygon.containsPolygon(innerPolygon);
	});
	return selectStrokes(state, innerStrokes);
};
