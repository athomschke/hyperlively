// @flow
import { merge, find } from 'lodash';

import type { Stroke } from 'src/client/app/typeDefinitions';
import { DEFAULT_PEN_COLOR } from 'src/client/app/constants/drawing';
import { finishStroke, hide, select, updatePosition } from 'src/client/app/actionCreators';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { UPDATE_POSITION, ROTATE_BY, HIDE, SELECT, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import type {
	FINISH_STROKE_ACTION, UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { points, type PointsActionType, pointsActions } from './points';

export type StrokeActionType = PointsActionType |
FINISH_STROKE_ACTION | UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | ROTATE_BY_ACTION

export const strokeActions = {
	...pointsActions,
	UPDATE_POSITION: updatePosition,
	HIDE: hide,
	SELECT: select,
	FINISH_STROKE: finishStroke,
};

const initialStrokeState = (): Stroke => ({
	points: points(undefined, { type: '' }),
	hidden: false,
	selected: false,
	finished: false,
	color: DEFAULT_PEN_COLOR,
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

const doStrokesContainStroke = (strokes: Array<Stroke>, aStroke: Stroke) =>
	find(strokes, stateStroke =>
		stateStroke.hidden === aStroke.hidden &&
		stateStroke.points.length === aStroke.points.length &&
		stateStroke.points[0].timeStamp === aStroke.points[0].timeStamp,
	);

type StrokeReducer = (state: Stroke, action: StrokeActionType) => Stroke

const scopedStrokeReducer: StrokeReducer = (state, action) => {
	switch (action.type) {
	case UPDATE_POSITION:
	{
		if (doStrokesContainStroke(action.strokes, state)) {
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
		if (doStrokesContainStroke(action.strokes, state)) {
			return merge({}, state, {
				points: points(state.points, action),
			});
		}
		return state;
	}
	case HIDE:
		if (doStrokesContainStroke(action.strokes, state)) return merge({}, state, { hidden: true });
		return state;
	case SELECT:
		if (doStrokesContainStroke(action.strokes, state)) {
			return merge({}, state, {
				selected: true,
			});
		}
		if (state.selected) {
			const newStroke: Stroke = merge({}, state);
			newStroke.selected = false;
			return newStroke;
		}
		return state;
	case FINISH_STROKE:
		return merge({}, state, {
			points: points(state.points, action),
			finished: true,
		});
	default:
		if (Object.keys(pointsActions).includes(action.type)) {
			return merge({}, state, { points: points(state.points, action) });
		}
		return state;
	}
};

const stroke = scopeToActions(scopedStrokeReducer, strokeActions, initialStrokeState);

export { stroke };
