// @flow
import {
	map, last, without, flatten,
} from 'lodash';
import Polygon from 'polygon';

import scopeToActions from 'src/reducers/scopeToActions';
import type { Stroke } from 'src/types';
import {
	APPEND_STROKE, APPEND_POINT, FINISH_STROKE, SELECT_INSIDE, SELECT_AT,
} from 'src/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
	SELECT_INSIDE_ACTION, SELECT_AT_ACTION,
} from 'src/actionTypeDefinitions';
import {
	select, selectInside, createStroke, appendPoint, selectAt,
} from 'src/actionCreators';

import { stroke, strokeActions, type StrokeActionType } from './stroke';

export type StrokesActionType = StrokeActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION | SELECT_INSIDE_ACTION | SELECT_AT_ACTION

const initialStrokesState = (): Array<Stroke> => [];

export const strokesActions = {
	...strokeActions,
	APPEND_STROKE: createStroke,
	APPEND_POINT: appendPoint,
	SELECT_INSIDE: selectInside,
	SELECT_AT: selectAt,
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
	case SELECT_AT: {
		const selectAtAction: SELECT_AT_ACTION = action;
		const strokesContainingPoint = state.filter((possiblyContainingStroke) => {
			const outerPolygon = new Polygon(possiblyContainingStroke.points);
			return outerPolygon.containsPoint({ x: selectAtAction.x, y: selectAtAction.y });
		});
		if (strokesContainingPoint.length > 0) {
			const strokeAction = select([strokesContainingPoint[0]]);
			return map(state, stateStroke => stroke(stateStroke, strokeAction));
		}
		return state;
	}
	default: {
		return map(state, stateStroke => stroke(stateStroke, action));
	}
	}
};

const strokes = scopeToActions(scopedStrokesReducer, strokesActions, initialStrokesState);

export { strokes };
