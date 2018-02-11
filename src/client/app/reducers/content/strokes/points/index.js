// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, ROTATE_BY } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';
import type { APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, UPDATE_POSITION_ACTION, ROTATE_BY_ACTION } from 'src/client/app/actionTypeDefinitions';

import { point } from './point';

type PointsActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
UPDATE_POSITION_ACTION | ROTATE_BY_ACTION

function points(state: Array<Point> = [], action: PointsActionType) {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return [
			...state,
			point(undefined, action),
		];
	case UPDATE_POSITION:
	case ROTATE_BY: {
		return state.map(statePoint => point(statePoint, action));
	}
	default:
		return state;
	}
}

export { points };
