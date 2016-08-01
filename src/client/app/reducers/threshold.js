import { UPDATE_THRESHOLD } from 'constants/actionTypes'

export default function threshold (state = 1, action) {
	switch(action.type) {
		case UPDATE_THRESHOLD:
			return action.number;
		default:
			return state;
	}
}