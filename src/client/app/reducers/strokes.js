import { points } from 'reducers/points';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_BOUNDS } from 'constants/actionTypes';
import { last, initial, forEach } from 'lodash';
import { appendPoint } from '../actions/drawing'

const appendPointTo = (state, action) => {
	return [...initial(state), {
		points: points(state.length > 0 ? last(state).points : [], appendPoint(action.event))
	}]
}

const appendStrokeTo = (state, action) => {
	return [...state, {
		points: points([], appendPoint(action.event)),
		position: {
				x: action.event.pageX,
				y: action.event.pageY
			}
	}]
}

const moveBy = (state, action) => {
	forEach(action.strokes, (stroke) => {
		forEach(stroke.points, (point) => {
			point.x += action.bounds.x
			point.y += action.bounds.y
		})
	})
}

function strokes (state = [], action) {
	switch(action.type) {
		case APPEND_POINT:
			return appendPointTo(state, action)
		case CREATE_STROKE:
			return appendStrokeTo(state, action)
		case FINISH_STROKE:
			let nextState = appendPointTo(state, action);
			last(nextState).finished = true;
			return nextState;
		case UPDATE_BOUNDS:
			moveBy(state, action);
			return state
		default:
			return state;
	}
}

export { strokes };