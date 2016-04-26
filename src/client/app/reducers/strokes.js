import * as actionTypes from 'constants/actionTypes';
import { without, last, concat, filter } from 'lodash'

export default function strokes(state = [[]], action) {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
			[]
			return [
				...without(state, last(state)),
				concat(last(state), [action.point])
			]
		default:
			return state;
	}
}