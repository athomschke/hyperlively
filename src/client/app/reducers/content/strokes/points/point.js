// @flow
import { merge } from 'lodash';

import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, ROTATE_BY } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';
import type { APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, UPDATE_POSITION_ACTION, ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

type PointsActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
UPDATE_POSITION_ACTION | ROTATE_BY_ACTION

const defaultPoint = () => ({
	x: NaN,
	y: NaN,
	timeStamp: NaN,
});

function point(state: Point = defaultPoint(), action: PointsActionType) {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return {
			x: action.x,
			y: action.y,
			timeStamp: action.timeStamp,
		};
	case UPDATE_POSITION: {
		const newCoordinates = {
			x: state.x + (action.target.x - action.origin.x),
			y: state.y + (action.target.y - action.origin.y),
		};
		return merge({}, state, newCoordinates);
	}
	case ROTATE_BY: {
		const radians = action.degrees;
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		const dX = state.x - action.centerX;
		const dY = state.y - action.centerY;
		return merge({}, state, {
			x: ((cos * dX) - (sin * dY)) + action.centerX,
			y: ((sin * dX) + (cos * dY)) + action.centerY,
		});
	}
	default:
		return state;
	}
}

export { point };
