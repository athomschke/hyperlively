// @flow
import { find, merge } from 'lodash';

import type { StrokeReference, Stroke } from 'src/types';
import {
	appendPoint,
	hide,
	select,
	updatePosition,
	rotateBy,
} from 'src/actionCreators';
import scopeToActions from 'src/reducers/scopeToActions';
import {
	APPEND_POINT,
	UPDATE_POSITION,
	ROTATE_BY,
	HIDE,
	SELECT,
} from 'src/constants/actionTypes';
import type {
	FINISH_STROKE_ACTION,
	APPEND_POINT_ACTION,
	UPDATE_POSITION_ACTION,
	HIDE_ACTION,
	SELECT_ACTION,
	ROTATE_BY_ACTION,
} from 'src/actionTypeDefinitions';

export type StrokeReferenceActionType = FINISH_STROKE_ACTION | APPEND_POINT_ACTION |
	UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | ROTATE_BY_ACTION

export const strokeReferenceActions = {
	APPEND_POINT: appendPoint,
	UPDATE_POSITION: updatePosition,
	ROTATE_BY: rotateBy,
	HIDE: hide,
	SELECT: select,
};

export const initialStrokeReferenceState = (): StrokeReference => ({
	id: NaN,
	length: 0,
	hidden: false,
	selected: false,
	angle: 0,
	center: {
		x: 0,
		y: 0,
	},
	position: {
		x: 0,
		y: 0,
	},
});

type StrokeReducer = (state: StrokeReference, action: StrokeReferenceActionType) => StrokeReference

export const doStrokesContainStrokeReference = (
	strokes: Array<Stroke>,
	aStroke: StrokeReference,
) => find(strokes, stateStroke => stateStroke.id === aStroke.id);

const scopedStrokeReferenceReducer: StrokeReducer = (state, action) => {
	switch (action.type) {
	case APPEND_POINT:
		return {
			...initialStrokeReferenceState(),
			...state,
			length: state.length + 1,
		};
	case UPDATE_POSITION:
	{
		if (doStrokesContainStrokeReference(action.strokes, state)) {
			return {
				...state,
				position: {
					x: state.position.x + (action.target.x - action.origin.x),
					y: state.position.y + (action.target.y - action.origin.y),
				},
			};
		}
		return state;
	}
	case ROTATE_BY: {
		if (doStrokesContainStrokeReference(action.strokes, state)) {
			return {
				...state,
				angle: (state.angle + action.degrees) % 360,
				center: {
					x: action.centerX,
					y: action.centerY,
				},
			};
		}
		return state;
	}
	case HIDE:
		if (doStrokesContainStrokeReference(action.strokes, state)) return merge({}, state, { hidden: true });
		return state;
	case SELECT:
		if (doStrokesContainStrokeReference(action.strokes, state)) {
			return merge({}, state, {
				selected: true,
			});
		}
		if (state.selected) {
			const newStroke: StrokeReference = merge({}, state);
			newStroke.selected = false;
			return newStroke;
		}
		return state;
	default:
		return state;
	}
};

const strokeReference = scopeToActions(scopedStrokeReferenceReducer, strokeReferenceActions, initialStrokeReferenceState);

export { strokeReference };
