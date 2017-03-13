// @flow
import { TOGGLE_PLOMA } from 'constants/actionTypes';
import { defaultUsePloma } from './defaultState';
import { type PlomaState } from '../typeDefinitions';
import { type TOGGLE_PLOMA_ACTION } from '../actionTypeDefinitions';

const initialState = () => ({
	usePloma: defaultUsePloma,
	uniqueCanvasFactor: Math.random(),
});

function ploma(state: PlomaState = initialState(), action: TOGGLE_PLOMA_ACTION) {
	switch (action.type) {
	case TOGGLE_PLOMA:
		return {
			usePloma: action.boolean,
			uniqueCanvasFactor: state.uniqueCanvasFactor,
		};
	default:
		return state;
	}
}

export { ploma };
