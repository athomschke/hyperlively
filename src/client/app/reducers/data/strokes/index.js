// @flow
import { map, last, without, flatten } from 'lodash';
import Polygon from 'polygon';

import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { Stroke } from 'src/client/app/typeDefinitions';
import {
	APPEND_STROKE, APPEND_POINT, FINISH_STROKE, SELECT_INSIDE,
} from 'src/client/app/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
	SELECT_INSIDE_ACTION,
} from 'src/client/app/actionTypeDefinitions';
import { select, selectInside, createStroke, appendPoint } from 'src/client/app/actionCreators';

import { stroke, strokeActions, type StrokeActionType } from './stroke';

export type StrokesActionType = StrokeActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION | SELECT_INSIDE_ACTION

const initialStrokesState = (): Array<Stroke> => [];

export const strokesActions = {
	...strokeActions,
	APPEND_STROKE: createStroke,
	APPEND_POINT: appendPoint,
	SELECT_INSIDE: selectInside,
};

type StrokesReducer = (state: Array<Stroke>, action: StrokesActionType) => Array<Stroke>;

const scopedStrokesReducer: StrokesReducer = (state, action) => {
	switch (action.type) {
	case APPEND_STROKE:
		return [
			...state,
			stroke(undefined, action),
		];
	case APPEND_POINT:
	case FINISH_STROKE: {
		return [
			...state.slice(0, -1),
			stroke(last(state), action),
		];
	}
	case SELECT_INSIDE: {
		const outerPolygon = new Polygon(flatten(map(action.strokes, 'points')));
		const innerStrokes = without(state, ...action.strokes).filter((innerStroke) => {
			if (innerStroke.hidden) {
				return false;
			}
			const innerPolygon = new Polygon(innerStroke.points);
			return outerPolygon.containsPolygon(innerPolygon);
		});
		const strokeAction = select(innerStrokes);
		return map(state, stateStroke => stroke(stateStroke, strokeAction));
	}
	default: {
		return map(state, stateStroke => stroke(stateStroke, action));
	}
	}
};

const strokes = scopeToActions(scopedStrokesReducer, strokesActions, initialStrokesState);

export { strokes };
