// @flow
import { map, last } from 'lodash';

import scopeToActions from 'src/reducers/scopeToActions';
import type { Stroke } from 'src/types';
import {
	APPEND_STROKE, APPEND_POINT, FINISH_STROKE,
} from 'src/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
} from 'src/actionTypeDefinitions';
import {
	createStroke, appendPoint,
} from 'src/actionCreators';

import { stroke, strokeActions, type StrokeActionType } from './stroke';

export type StrokesActionType = StrokeActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION

const initialStrokesState = (): Array<Stroke> => [];

export const strokesActions = {
	...strokeActions,
	APPEND_STROKE: createStroke,
	APPEND_POINT: appendPoint,
};

type StrokesReducer = (state: Array<Stroke>, action: StrokesActionType) => Array<Stroke>;

const scopedStrokesReducer: StrokesReducer = (state, action) => {
	switch (action.type) {
	case APPEND_STROKE:
		return [
			...state,
			{
				...stroke(undefined, action),
				id: action.id,
			},
		];
	case APPEND_POINT:
	case FINISH_STROKE: {
		return [
			...state.slice(0, -1),
			stroke(last(state), action),
		];
	}
	default: {
		return map(state, stateStroke => stroke(stateStroke, action));
	}
	}
};

const strokes = scopeToActions(scopedStrokesReducer, strokesActions, initialStrokesState);

export { strokes };
