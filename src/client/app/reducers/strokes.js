import points from 'reducers/points';
import * as actionTypes from 'constants/actionTypes';
import { without, last, concat, filter } from 'lodash';

const strokes = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
			if (state.length > 1) {
				let head = without(state, last(state));
				let tail = {
					points: points(last(state).points, action)
				}
				return head.concat([tail])
			} else if (state.length > 0) {
				return [{
					points: points(last(state).points, action)
				}]
			} else {
				return [{
					points: points([], action)
				}];
			}
		case actionTypes.CREATE_STROKE:
			return state.concat([{
				points: points([], {
					type: actionTypes.APPEND_POINT,
					point: action.point
				})
			}])
		case actionTypes.FINISH_STROKE:
			state.last().finished = true;
			return state
		default:
			return state;
	}
}

export default strokes;