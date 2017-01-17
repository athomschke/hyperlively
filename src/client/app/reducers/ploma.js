import { TOGGLE_PLOMA } from 'constants/actionTypes';
import { defaultUsePloma } from './defaultState';

let initialState = () => {
	return {
		usePloma: defaultUsePloma,
		uniqueCanvasFactor: Math.random()
	};
};

function ploma (state = initialState(), action) {
	switch(action.type) {
	case TOGGLE_PLOMA:
		return {
			usePloma: action.bool,
			uniqueCanvasFactor: state.uniqueCanvasFactor
		};
	default:
		return state;
	}
}

export { ploma };