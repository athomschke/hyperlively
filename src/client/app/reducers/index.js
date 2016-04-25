import * as actionTypes from '../actionTypes';
import { combineReducers } from 'redux';

function points(state = [], action) {
	switch(action.type) {
		case actionTypes.ADD_POINT:
		return [
			...state,
			action.point
		]
		default:
			return state;
	}
}

const hyperlively = combineReducers({
	points
})

export default hyperlively;