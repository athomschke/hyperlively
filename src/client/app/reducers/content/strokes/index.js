// @flow
import type { Stroke } from 'src/client/app/typeDefinitions';
import {
	APPEND_STROKE, APPEND_POINT, FINISH_STROKE,
	UPDATE_POSITION, ROTATE_BY, HIDE, SELECT, SELECT_INSIDE,
} from 'src/client/app/constants/actionTypes';
import type {
	APPEND_STROKE_ACTION, APPEND_POINT_ACTION, FINISH_STROKE_ACTION,
	UPDATE_POSITION_ACTION, HIDE_ACTION, SELECT_ACTION, SELECT_INSIDE_ACTION,
	ROTATE_BY_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { appendStroke, appendPoint, finishStroke } from './strokeCreation';
import { updatePosition, rotateBy, hide, select, selectInside } from './strokeManipulation';

type StrokeAktionType = APPEND_STROKE_ACTION | APPEND_POINT_ACTION | FINISH_STROKE_ACTION |
	UPDATE_POSITION_ACTION | HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION | ROTATE_BY_ACTION

function strokes(state: Array<Stroke> = [], action: StrokeAktionType) {
	switch (action.type) {
	case APPEND_STROKE:
		return appendStroke(state, action);
	case APPEND_POINT:
		return appendPoint(state, action);
	case FINISH_STROKE:
		return finishStroke(state, action);
	case UPDATE_POSITION:
		return updatePosition(state, action);
	case ROTATE_BY:
		return rotateBy(state, action);
	case HIDE:
		return hide(state, action);
	case SELECT:
		return select(state, action);
	case SELECT_INSIDE:
		return selectInside(state, action);
	default:
		return state;
	}
}

export { strokes };
