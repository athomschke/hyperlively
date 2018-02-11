// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import { type Point } from 'src/client/app/typeDefinitions';

import { point, pointActionTypes, type PointActionType } from './point';

export type PointsActionType = PointActionType;
export const pointsActionTypes = [...pointActionTypes, APPEND_STROKE, FINISH_STROKE, APPEND_POINT];

function points(state: Array<Point> = [], action: PointsActionType) {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return [
			...state,
			{ x: action.x, y: action.y, timeStamp: action.timeStamp },
		];
	default:
		if (pointActionTypes.includes(action.type)) {
			return state.map(statePoint => point(statePoint, action));
		}
		return state;
	}
}

export { points };
