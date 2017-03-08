// @flow
import { TOGGLE_PLOMA } from 'constants/actionTypes';
import { defaultUsePloma } from './defaultState';
import { type PlomaState } from '../typeDefinitions';

const initialState = () => ({
	usePloma: defaultUsePloma,
	uniqueCanvasFactor: Math.random(),
});

function ploma(state: PlomaState = initialState(), action) {
	switch (action.type) {
	case TOGGLE_PLOMA:
		return {
			usePloma: action.bool,
			uniqueCanvasFactor: state.uniqueCanvasFactor,
		};
	default:
		return state;
	}
}

export { ploma };
