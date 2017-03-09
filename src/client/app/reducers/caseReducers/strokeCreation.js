// @flow
import { last } from 'lodash';
import { appendPoint as appendPointAction } from 'actions/drawing';
import { points } from '../points';
import { type Stroke } from '../../typeDefinitions';

export const appendStroke = (state: Array<Stroke>, action) => {
	const newState = state.slice(0);
	return newState.concat([{
		actionIndex: action.index,
		points: points([], appendPointAction(action.x, action.y, action.timeStamp)),
		position: {
			x: action.x,
			y: action.y,
		},
	}]);
};

export const appendPoint = (state: Array<Stroke>, action) => {
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

export const finishStroke = (state: Array<Stroke>, action) => {
	const nextState = appendPoint(state, action);
	last(nextState).finished = true;
	return nextState;
};
