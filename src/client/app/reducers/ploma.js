// @flow
import { TOGGLE_PLOMA } from 'src/client/app/constants/actionTypes';
import { type PlomaState } from 'src/client/app/typeDefinitions';
import { type TOGGLE_PLOMA_ACTION } from 'src/client/app/actionTypeDefinitions';

import { defaultUsePloma } from './defaultState';

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
