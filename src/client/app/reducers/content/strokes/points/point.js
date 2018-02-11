// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';
import type { APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION } from 'src/client/app/actionTypeDefinitions';

type PointsActionType = APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION

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
	default:
		return state;
	}
}

export { point };
