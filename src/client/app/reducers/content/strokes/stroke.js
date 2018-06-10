// @flow
import { merge, isEqual, find } from 'lodash';

import type { Stroke } from 'src/client/app/typeDefinitions';
import { DEFAULT_PEN_COLOR } from 'src/client/app/constants/drawing';
import { finishStroke } from 'src/client/app/actions/drawing';
import { hide, select } from 'src/client/app/actions/manipulating';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { UPDATE_POSITION, ROTATE_BY, HIDE, SELECT, FINISH_STROKE } from 'src/client/app/constants/actionTypes';
import type {
	FINISH_STROKE_ACTION, UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { points, pointsActionTypes, initialPointsState, type PointsActionType, pointsActions } from './points';

export type StrokeActionType = PointsActionType |
FINISH_STROKE_ACTION | UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | ROTATE_BY_ACTION

export const strokeActionTypes = [
	...pointsActionTypes,
	HIDE, SELECT, FINISH_STROKE,
];

export const strokeActions = {
	...pointsActions,
	HIDE: hide,
	SELECT: select,
	FINISH_STROKE: finishStroke,
};

const defaultStroke = (): Stroke => ({
	points: initialPointsState(),
	hidden: false,
	selected: false,
	finished: false,
	color: DEFAULT_PEN_COLOR,
});

const doStrokesContainStroke = (strokes: Array<Stroke>, aStroke: Stroke) =>
	find(strokes, stateStroke =>
		stateStroke.hidden === aStroke.hidden && isEqual(stateStroke.points, aStroke.points));

const stroke = scopeToActions((state: Stroke = defaultStroke(), action: StrokeActionType) => {
	switch (action.type) {
	case UPDATE_POSITION:
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
		if (pointsActionTypes.includes(action.type)) {
			return merge({}, state, { points: points(state.points, action) });
		}
		return state;
	}
}, strokeActions, defaultStroke());

export { stroke };
