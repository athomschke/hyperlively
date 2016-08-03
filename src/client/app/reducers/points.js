import * as actionTypes from 'constants/actionTypes';

const points = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
			return state.concat([{
				x: action.event.pageX,
				y: action.event.pageY,
				timestamp: action.event.timeStamp
			}])
		default:
			return state;
	}
}

export default points;