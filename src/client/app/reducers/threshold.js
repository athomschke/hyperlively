import { UPDATE_THRESHOLD } from 'constants/actionTypes';

function threshold (state = 500, action) {
	switch(action.type) {
	case UPDATE_THRESHOLD:
		return action.number;
	default:
		return state;
	}
}

export { threshold };