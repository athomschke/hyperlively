// @flow
import { EXPAND_ACTIONS_PATH } from 'src/constants/actionTypes';
import type { EXPAND_ACTIONS_PATH_ACTION, CHECK_ACTIONS_PATH_ACTION } from 'src/actionTypeDefinitions';
import { collapseActionsPath } from 'src/actionCreators';
import type { JSONChooserState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

const expandedPathActions = {
	EXPAND_ACTIONS_PATH: collapseActionsPath,
};

const collapsedPath = scopeToActions((state, action: EXPAND_ACTIONS_PATH_ACTION) => {
	if (action.type === EXPAND_ACTIONS_PATH) {
		return action.path;
	}
	return state;
}, expandedPathActions, () => []);

export type ACTIONS_ACTION = EXPAND_ACTIONS_PATH_ACTION | CHECK_ACTIONS_PATH_ACTION;

export const actionsActions = {
	...expandedPathActions,
};

const initialActionsState = () => ({
	expandedPath: collapsedPath(undefined, { type: '' }),
});

const actions = scopeToActions((state: JSONChooserState, action: ACTIONS_ACTION) => ({
	expandedPath: collapsedPath(state.expandedPath, action),
}), actionsActions, initialActionsState);

export { actions };
