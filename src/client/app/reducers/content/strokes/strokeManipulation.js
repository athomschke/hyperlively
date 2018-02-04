// @flow
import { find, map, isEqual, without, flatten, filter, merge } from 'lodash';
import Polygon from 'polygon';

import type { Stroke } from 'src/client/app/typeDefinitions';
import type { UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, SELECT_INSIDE_ACTION, ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

export const updatePosition = (state: Array<Stroke>, action: UPDATE_POSITION_ACTION) => {
	const moveByPoint = {
		x: action.target.x - action.origin.x,
		y: action.target.y - action.origin.y,
	};
	return map(state, (stateStroke, i) => {
		if (isEqual(action.strokes[i], stateStroke)) {
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

export const rotatePoint = (
	pointX: number, pointY: number,
	originX: number, originY: number,
	angle: number,
) => {
	// const radians = (angle * Math.PI) / 180.0;
	const radians = angle;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const dX = pointX - originX;
	const dY = pointY - originY;

	return {
		x: ((cos * dX) - (sin * dY)) + originX,
		y: ((sin * dX) + (cos * dY)) + originY,
	};
};

const doStrokesContainStroke = (strokes: Array<Stroke>, stroke: Stroke) => {
	const matchingInStrokeProperties = filter(strokes, stateStroke =>
		stateStroke.hidden === stroke.hidden);
	return find(map(matchingInStrokeProperties, 'points'), points =>
		isEqual(points, stroke.points));
};

export const rotateBy = (state: Stroke[], action: ROTATE_BY_ACTION) => {
	const centerX = action.centerX;
	const centerY = action.centerY;
	const degrees = action.degrees;
	return state.map((stroke) => {
		if (!doStrokesContainStroke(action.strokes, stroke)) return stroke;

		const newStroke = merge({}, stroke, {
			points: stroke.points.map((point) => {
				const rotatedPoint = rotatePoint(point.x, point.y, centerX, centerY, degrees);
				return {
					x: rotatedPoint.x,
					y: rotatedPoint.y,
					timeStamp: point.timeStamp,
				};
			}),
		});
		return newStroke;
	});
};

export const hide = (state: Array<Stroke>, action: HIDE_ACTION) =>
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

export const select = (state: Array<Stroke>, action: SELECT_ACTION) =>
		selectStrokes(state, action.strokes);

export const selectInside = (state: Array<Stroke>, action: SELECT_INSIDE_ACTION) => {
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
