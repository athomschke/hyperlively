// @flow
import { merge, isEqual, find } from 'lodash';

import type { Stroke } from 'src/client/app/typeDefinitions';
import { DEFAULT_PEN_COLOR } from 'src/client/app/constants/drawing';
import { UPDATE_POSITION, ROTATE_BY, HIDE, SELECT, APPEND_STROKE, APPEND_POINT, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
	UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';
import { appendPoint as appendPointAction } from 'src/client/app/actions/drawing';

import { points } from './points';

type StrokeAktionType = APPEND_STROKE_ACTION | APPEND_POINT_ACTION | FINISH_STROKE_ACTION |
	UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | ROTATE_BY_ACTION

const defaultStroke = () => ({
	points: points(undefined, {}),
	hidden: false,
	selected: false,
	finished: false,
	color: DEFAULT_PEN_COLOR,
});

const doStrokesContainStroke = (strokes: Array<Stroke>, aStroke: Stroke) =>
	find(strokes, stateStroke =>
		stateStroke.hidden === aStroke.hidden && isEqual(stateStroke.points, aStroke.points));

const updatePosition = (state: Stroke, action: UPDATE_POSITION_ACTION) => {
	const moveByPoint = {
		x: action.target.x - action.origin.x,
		y: action.target.y - action.origin.y,
	};
	const newPoints = state.points.map((point) => {
		const newCoordinates = {
			x: point.x + moveByPoint.x,
			y: point.y + moveByPoint.y,
		};
		return merge({}, point, newCoordinates);
	});
	return merge({}, state, {
		points: newPoints,
	});
};

export const rotatePoint = (
	pointX: number, pointY: number,
	originX: number, originY: number,
	angle: number,
) => {
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

const rotateBy = (state: Stroke, action: ROTATE_BY_ACTION) => merge({}, state, {
	points: state.points.map((point) => {
		const rotatedPoint = rotatePoint(point.x, point.y, action.centerX,
			action.centerY, action.degrees);
		return {
			x: rotatedPoint.x,
			y: rotatedPoint.y,
			timeStamp: point.timeStamp,
		};
	}),
});

const hide = (state: Stroke, _action: HIDE_ACTION) => merge({}, state, {
	hidden: true,
});

const selectStrokes = (state: Stroke, strokes: Array<Stroke>) => {
	if (doStrokesContainStroke(strokes, state)) {
		return merge({}, state, {
			selected: true,
		});
	}
	if (state.selected) {
		const newStroke = merge({}, state);
		delete newStroke.selected;
		return newStroke;
	}
	return state;
};

function stroke(state: Stroke = defaultStroke(), action: StrokeAktionType) {
	switch (action.type) {
	case UPDATE_POSITION: {
		if (doStrokesContainStroke(action.strokes, state)) return updatePosition(state, action);
		return state;
	}
	case ROTATE_BY: {
		if (doStrokesContainStroke(action.strokes, state)) return rotateBy(state, action);
		return state;
	}
	case HIDE:
		if (doStrokesContainStroke(action.strokes, state)) return hide(state, action);
		return state;
	case SELECT:
		return selectStrokes(state, action.strokes);
	case APPEND_STROKE:
		return merge({}, state, {
			points: points(state.points, appendPointAction(action.x, action.y, action.timeStamp)),
		});
	case FINISH_STROKE:
		return merge({}, state, {
			points: points(state.points, appendPointAction(action.x, action.y, action.timeStamp)),
			finished: true,
		});
	case APPEND_POINT: {
		return {
			points: points(state.points, action),
		};
	}
	default:
		return merge({}, state, { points: points(state.points, action) });
	}
}

export { stroke };
