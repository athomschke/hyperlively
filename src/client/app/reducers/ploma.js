import * as actionTypes from 'constants/actionTypes';

const ploma = (state = false, action) => {
	switch(action.type) {
		case actionTypes.TOGGLE_PLOMA:
			return action.bool;
		default:
			return state;
	}
}

export default ploma;