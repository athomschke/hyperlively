// @flow
import {
	map,
	last,
	flatten,
} from 'lodash';
import Polygon from 'polygon';

import scopeToActions from 'src/reducers/scopeToActions';
import type { StrokeReference, StateStroke } from 'src/types';
import {
	APPEND_STROKE,
	APPEND_POINT,
	FINISH_STROKE,
	SELECT_INSIDE,
	SELECT_AT,
} from 'src/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION,
	APPEND_POINT_ACTION,
	FINISH_STROKE_ACTION,
	SELECT_INSIDE_ACTION,
	SELECT_AT_ACTION,
} from 'src/actionTypeDefinitions';
import {
	select,
	createStroke,
	appendPoint,
	selectAt,
	selectInside,
} from 'src/actionCreators';

import {
	strokeReference,
	strokeReferenceActions,
	initialStrokeReferenceState,
	type StrokeReferenceActionType,
} from './strokeReference';

export type ENHANCED_SELECT_AT_ACTION = SELECT_AT_ACTION & {
	allStrokes: Array<StateStroke>
}

export type ENHANCED_SELECT_INSIDE_ACTION = SELECT_INSIDE_ACTION & {
	allStrokes: Array<StateStroke>
}

export type StrokeReferencesActionType = StrokeReferenceActionType | APPEND_STROKE_ACTION | APPEND_POINT_ACTION |
FINISH_STROKE_ACTION | ENHANCED_SELECT_INSIDE_ACTION | ENHANCED_SELECT_AT_ACTION

const initialStrokeReferencesState = (): Array<StrokeReference> => [];

export const strokeReferencesActions = {
	...strokeReferenceActions,
	APPEND_STROKE: createStroke,
	APPEND_POINT: appendPoint,
	SELECT_INSIDE: selectInside,
	SELECT_AT: selectAt,
};

type StrokeReferencesReducer = (state: Array<StrokeReference>, action: StrokeReferencesActionType) => Array<StrokeReference>;

const scopedStrokeReferencesReducer: StrokeReferencesReducer = (state, action) => {
	switch (action.type) {
	case APPEND_STROKE:
		return [
			...state,
			{
				...initialStrokeReferenceState(),
				length: 1,
				id: action.id,
			},
		];
	case APPEND_POINT:
	case FINISH_STROKE: {
		return [
			...state.slice(0, -1),
			strokeReference(last(state), action),
		];
	}
	case SELECT_INSIDE: {
		const selectInsideAction: ENHANCED_SELECT_INSIDE_ACTION = action;
		const movedOuterPoints = flatten(map(selectInsideAction.strokes, (stroke) => {
			const originalPoints = stroke.points;
			return originalPoints.map(point => ({
				...point,
				x: point.x + stroke.position.x,
				y: point.y + stroke.position.y,
			}));
		}));
		const outerPolygon = new Polygon(movedOuterPoints);
		const innerStateStrokes = action.allStrokes.filter((innerStateStroke) => {
			if (selectInsideAction.strokes.find(actionStroke => actionStroke.id === innerStateStroke.id)) return false;
			const innerStrokeReference = state.find(possHiddenStrokeReference => possHiddenStrokeReference.id === innerStateStroke.id);
			if (innerStrokeReference) {
				if (innerStrokeReference.hidden) {
					return false;
				}
				const innerPolygon = new Polygon(innerStateStroke.points.map(point => ({
					...point,
					x: point.x + innerStrokeReference.position.x,
					y: point.y + innerStrokeReference.position.y,
				})));
				return outerPolygon.containsPolygon(innerPolygon);
			}
			return false;
		});
		const innerStrokes = innerStateStrokes.map(innerStroke => ({
			...innerStroke,
			...state.find(innerStrokeReference => innerStrokeReference.id === innerStroke.id),
		}));
		const strokeAction = select(innerStrokes);
		return map(state, stateStroke => strokeReference(stateStroke, strokeAction));
	}
	case SELECT_AT: {
		const selectAtAction: ENHANCED_SELECT_AT_ACTION = action;
		const strokesContainingPoint = action.strokes.filter((possiblyContainingStroke) => {
			const possiblyHiddenStrokeReference = state.find(
				possHiddenStrokeReference => possHiddenStrokeReference.id === possiblyContainingStroke.id,
			);
			if (possiblyHiddenStrokeReference && possiblyHiddenStrokeReference.hidden) {
				return false;
			}
			const outerPolygon = new Polygon(possiblyContainingStroke.points.map(point => ({
				...point,
				x: point.x + possiblyContainingStroke.position.x,
				y: point.y + possiblyContainingStroke.position.y,
			})));
			return outerPolygon.containsPoint({ x: selectAtAction.x, y: selectAtAction.y });
		});
		if (strokesContainingPoint.length > 0) {
			const strokeAction = select([strokesContainingPoint[0]]);
			return map(state, stateStroke => strokeReference(stateStroke, strokeAction));
		}
		return state;
	}
	default: {
		return map(state, stateStroke => strokeReference(stateStroke, action));
	}
	}
};

const strokeReferences = scopeToActions(scopedStrokeReferencesReducer, strokeReferencesActions, initialStrokeReferencesState);

export { strokeReferences };
