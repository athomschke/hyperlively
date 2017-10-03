// @flow
import { concat } from 'lodash';

import { APPEND_SPECIFC_ACTION } from 'constants/actionTypes';
import { type APPEND_SPECIFC_ACTION_ACTION } from '../actionTypeDefinitions';
import { type ActionMapping } from '../typeDefinitions';

const deleteInside = {
	actionName: 'deleteInside',
	actionNames: ['selectInside', 'hide'],
};

function specificActions(
		state: Array<ActionMapping> = [deleteInside],
		action: APPEND_SPECIFC_ACTION_ACTION,
	) {
	switch (action.type) {
	case APPEND_SPECIFC_ACTION: {
		const { actionName, actionNames } = action;
		return concat(state, [{ actionName, actionNames }]);
	}
	default:
		return state;
	}
}

export { specificActions };
