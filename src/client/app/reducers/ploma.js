// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { togglePloma } from 'src/client/app/actions/configuring';
import { TOGGLE_PLOMA } from 'src/client/app/constants/actionTypes';
import { type PlomaState } from 'src/client/app/typeDefinitions';
import { type TOGGLE_PLOMA_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialPlomaState = () => ({
	usePloma: true,
	uniqueCanvasFactor: Math.random(),
});

const plomaActions = {
	TOGGLE_PLOMA: togglePloma,
};

const ploma = scopeToActions(
(state: PlomaState = initialPlomaState(), action: TOGGLE_PLOMA_ACTION) => {
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
