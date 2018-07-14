// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE } from 'src/constants/actionTypes';
import { createStroke, finishStroke, appendPoint } from 'src/actionCreators';
import type { APPEND_STROKE_ACTION, FINISH_STROKE_ACTION, APPEND_POINT_ACTION } from 'src/actionTypeDefinitions';
import scopeToActions from 'src/reducers/scopeToActions';
import { type Point } from 'src/types';

export type PointsActionType = APPEND_STROKE_ACTION | FINISH_STROKE_ACTION | APPEND_POINT_ACTION;

export const pointsActions = {
	APPEND_STROKE: createStroke,
	FINISH_STROKE: finishStroke,
	APPEND_POINT: appendPoint,
};

const initialPointsState = (): Array<Point> => [];

type PointsReducer = (state: Array<Point>, action: PointsActionType) => Array<Point>;

const scopedPoints: PointsReducer = (state, action) => {
	switch (action.type) {
	case APPEND_STROKE:
	case FINISH_STROKE:
	case APPEND_POINT:
		return [
			...state,
			{ x: action.x, y: action.y, timeStamp: action.timeStamp },
		];
	default: {
		return state;
	}
	}
};

const points = scopeToActions(scopedPoints, pointsActions, initialPointsState);

export { points };
