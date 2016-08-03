import points from 'reducers/points';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE } from 'constants/actionTypes';
import { last, initial } from 'lodash';
import { appendPoint } from '../actions/drawing'

const appendPointTo = (state, action) => {
	return [...initial(state), {
		points: points(state.length > 0 ? last(state).points : [], appendPoint(action.event))
	}]
}

const appendStrokeTo = (state, action) => {
	return [...state, {
		points: points([], appendPoint(action.event))
	}]
}

const strokes = (state = [], action) => {
	switch(action.type) {
		case APPEND_POINT:
			return appendPointTo(state, action)
		case CREATE_STROKE:
			return appendStrokeTo(state, action)
		case FINISH_STROKE:
			let nextState = appendPointTo(state, action);
			last(nextState).finished = true;
			return nextState;
		default:
			return state;
	}
}

export default strokes;