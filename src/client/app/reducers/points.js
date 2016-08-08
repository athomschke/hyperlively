import { APPEND_POINT } from 'constants/actionTypes';

function points (state = [], action) {
	switch(action.type) {
		case APPEND_POINT:
			return state.concat([{
				x: action.event.pageX,
				y: action.event.pageY,
				timestamp: action.event.timeStamp
			}])
		default:
			return state;
	}
}

export { points };