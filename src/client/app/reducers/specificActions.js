// @flow
import { concat } from 'lodash';

import { APPEND_SPECIFC_ACTION } from 'src/client/app/constants/actionTypes';
import { type APPEND_SPECIFC_ACTION_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type ActionMapping } from 'src/client/app/typeDefinitions';

export const initialSpecificActionsState = () => [{
	actionName: 'deleteInside',
	actionNames: ['selectInside', 'hide'],
}];

function specificActions(
		state: Array<ActionMapping> = initialSpecificActionsState(),
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
