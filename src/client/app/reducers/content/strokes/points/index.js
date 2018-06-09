// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import type { APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, APPEND_POINT_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type Point } from 'src/client/app/typeDefinitions';

import { point, pointActionTypes, type PointActionType } from './point';

export type PointsActionType = PointActionType |
		APPEND_STROKE_ACTION | FINISH_STROKE_ACTION | APPEND_POINT_ACTION;
export const pointsActionTypes = [...pointActionTypes, APPEND_STROKE, FINISH_STROKE, APPEND_POINT];

export const initialPointsState = (): Array<Point> => [];

function points(
		state: Array<Point> = initialPointsState(),
		action: PointsActionType,
	): Array<Point> {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return [
			...state,
			{ x: action.x, y: action.y, timeStamp: action.timeStamp },
		];
	default: {
		const pointAction: PointActionType = action;
		return state.map((statePoint: Point) => point(statePoint, pointAction));
	}
	}
}

export { points };
