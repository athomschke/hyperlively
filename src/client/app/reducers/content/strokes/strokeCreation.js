// @flow
import { last } from 'lodash';

import { appendPoint as appendPointAction } from 'src/client/app/actions/drawing';
import { type Stroke } from 'src/client/app/typeDefinitions';
import { type APPEND_STROKE_ACTION, type APPEND_POINT_ACTION, type FINISH_STROKE_ACTION } from 'src/client/app/actionTypeDefinitions';

import { points } from './points';

export const appendStroke = (state: Array<Stroke>, action: APPEND_STROKE_ACTION) => {
	const newState = state.slice(0);
	return newState.concat([{
		points: points([], appendPointAction(action.x, action.y, action.timeStamp)),
	}]);
};

export const appendPoint = (state: Array<Stroke>, action: APPEND_POINT_ACTION) => {
	if (state.length > 0) {
		const newState = state.slice(0, -1);
		const manipulatedStroke = {
			points: points(last(state).points, appendPointAction(action.x, action.y, action.timeStamp)),
		};
		newState.push(Object.assign({}, last(state), manipulatedStroke));
		return newState;
	}
	return appendStroke(state, action);
};

export const finishStroke = (state: Array<Stroke>, action: FINISH_STROKE_ACTION) => {
	const nextState = appendPoint(state, action);
	last(nextState).finished = true;
	return nextState;
};
