// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import { createStroke, finishStroke, appendPoint } from 'src/client/app/actions/drawing';
import type { APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, APPEND_POINT_ACTION } from 'src/client/app/actionTypeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { type Point } from 'src/client/app/typeDefinitions';

import { point, pointActionTypes, type PointActionType, pointActions } from './point';

export type PointsActionType = PointActionType |
		APPEND_STROKE_ACTION | FINISH_STROKE_ACTION | APPEND_POINT_ACTION;
export const pointsActionTypes = [...pointActionTypes, APPEND_STROKE, FINISH_STROKE, APPEND_POINT];

export const pointsActions = {
	...pointActions,
	APPEND_STROKE: createStroke,
	FINISH_STROKE: finishStroke,
	APPEND_POINT: appendPoint,
};

export const initialPointsState = (): Array<Point> => [];

const points = scopeToActions((
		state: Array<Point> = initialPointsState(),
		action: PointsActionType,
	): Array<Point> => {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return [
			...state,
			{ x: action.x, y: action.y, timeStamp: action.timeStamp },
		];
	default: {
		return state.map((statePoint: Point) => point(statePoint, action));
	}
	}
}, pointsActions, initialPointsState);

export { points };
