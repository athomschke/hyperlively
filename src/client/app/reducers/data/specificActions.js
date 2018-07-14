// @flow
import { concat } from 'lodash';

import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { appendSpecificAction } from 'src/client/app/actionCreators';
import { APPEND_SPECIFC_ACTION } from 'src/client/app/constants/actionTypes';
import { type APPEND_SPECIFC_ACTION_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type ActionMapping } from 'src/client/app/types';

const initialSpecificActionsState = () => [{
	actionName: 'deleteInside',
	actionNames: ['selectInside', 'hide'],
}];

export type SPECIFIG_ACTIONS_ACTION = APPEND_SPECIFC_ACTION_ACTION;

export const specificActionsActions = {
	APPEND_SPECIFC_ACTION: appendSpecificAction,
};

type SpecificActionsReducer = (state: Array<ActionMapping>, action: SPECIFIG_ACTIONS_ACTION) =>
	Array<ActionMapping>

const scopedSpecificActions: SpecificActionsReducer = (state, action) => {
	switch (action.type) {
	case APPEND_SPECIFC_ACTION: {
		const { actionName, actionNames } = action;
		return concat(state, [{ actionName, actionNames }]);
	}
	default:
		return state;
	}
};

const specificActions = scopeToActions(
	scopedSpecificActions,
	specificActionsActions,
	initialSpecificActionsState,
);

export { specificActions };
