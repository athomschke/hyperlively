// @flow
import { map, last, without, flatten } from 'lodash';
import Polygon from 'polygon';

import type { Stroke } from 'src/client/app/typeDefinitions';
import {
	APPEND_STROKE, APPEND_POINT, FINISH_STROKE, SELECT_INSIDE,
} from 'src/client/app/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION, SELECT_INSIDE_ACTION, SELECT_ACTION,
} from 'src/client/app/actionTypeDefinitions';
import { select } from 'src/client/app/actions/manipulating';

import { stroke, strokeActionTypes, type StrokeActionType } from './stroke';

export type StrokesActionType = StrokeActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION | SELECT_INSIDE_ACTION

export const initialStrokesState: Array<Stroke> = [];

export const strokesActionTypes = [
	...strokeActionTypes,
	APPEND_STROKE, APPEND_POINT, SELECT_INSIDE,
];

function strokes(state: Array<Stroke> = initialStrokesState, action: StrokesActionType) {
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
		const strokeAction: SELECT_ACTION = select(innerStrokes);
		return map(state, stateStroke => stroke(stateStroke, strokeAction));
	}
	default: {
		const strokeAction: StrokeActionType = action;
		return map(state, stateStroke => stroke(stateStroke, strokeAction));
	}
	}
}

export { strokes };
