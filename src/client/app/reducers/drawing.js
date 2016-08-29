import { TOGGLE_DRAWING } from 'constants/actionTypes';

function drawing (state = false, action) {
	switch(action.type) {
	case TOGGLE_DRAWING:
		return action.bool;
	default:
		return state;
	}
}

export { drawing };