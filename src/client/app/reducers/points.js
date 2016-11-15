import { APPEND_POINT } from 'constants/actionTypes';

function points (state = [], action) {
	switch(action.type) {
	case APPEND_POINT:
		return state.concat([{
			x: action.x,
			y: action.y,
			timeStamp: action.timeStamp
		}]);
	default:
		return state;
	}
}

export { points };