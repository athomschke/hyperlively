// @flow
import { merge } from 'lodash';

import type { StateStroke } from 'src/types';
import { DEFAULT_PEN_COLOR } from 'src/constants/drawing';
import { finishStroke } from 'src/actionCreators';
import scopeToActions from 'src/reducers/scopeToActions';
import { FINISH_STROKE } from 'src/constants/actionTypes';
import type { FINISH_STROKE_ACTION } from 'src/actionTypeDefinitions';

import { points, type PointsActionType, pointsActions } from './points';

export type StrokeActionType = PointsActionType | FINISH_STROKE_ACTION

export const strokeActions = {
	...pointsActions,
	FINISH_STROKE: finishStroke,
};

const initialStrokeState = (): StateStroke => ({
	id: NaN,
	points: points(undefined, { type: '' }),
	finished: false,
	color: DEFAULT_PEN_COLOR,
});

type StrokeReducer = (state: StateStroke, action: StrokeActionType) => StateStroke

const scopedStrokeReducer: StrokeReducer = (state, action) => {
	switch (action.type) {
	case FINISH_STROKE:
		return {
			...state,
			points: points(state.points, action),
			finished: true,
		};
	default:
		if (Object.keys(pointsActions).includes(action.type)) {
			return merge({}, state, { points: points(state.points, action) });
		}
		return state;
	}
};

const stroke = scopeToActions(scopedStrokeReducer, strokeActions, initialStrokeState);

export { stroke };
