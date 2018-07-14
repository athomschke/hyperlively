// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { togglePloma } from 'src/actionCreators';
import { TOGGLE_PLOMA } from 'src/constants/actionTypes';
import { type PlomaState } from 'src/types';
import { type TOGGLE_PLOMA_ACTION } from 'src/actionTypeDefinitions';

const initialPlomaState = () => ({
	usePloma: true,
	uniqueCanvasFactor: Math.random(),
});

export type PLOMA_ACTION = TOGGLE_PLOMA_ACTION;

export const plomaActions = {
	TOGGLE_PLOMA: togglePloma,
};

const ploma = scopeToActions((state: PlomaState, action: PLOMA_ACTION) => {
	switch (action.type) {
	case TOGGLE_PLOMA:
		return {
			usePloma: action.boolean,
			uniqueCanvasFactor: state.uniqueCanvasFactor,
		};
	default:
		return state;
	}
}, plomaActions, initialPlomaState);

export { ploma };
