// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';
import type { APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { point } from './point';

type PointsActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION

function points(state: Array<Point> = [], action: PointsActionType) {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return state.concat([point(undefined, action)]);
	default:
		return state;
	}
}

export { points };
