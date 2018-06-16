// @flow
import { COLLAPSE_ACTIONS_PATH, CHECK_ACTIONS_PATH } from 'src/client/app/constants/actionTypes';
import type { COLLAPSE_ACTIONS_PATH_ACTION, CHECK_ACTIONS_PATH_ACTION } from 'src/client/app/actionTypeDefinitions';
import { collapseActionsPath, checkActionsPath } from 'src/client/app/actionCreators';
import type { JSONChooserState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

const collapsedPathActions = {
	COLLAPSE_ACTIONS_PATH: collapseActionsPath,
};

const collapsedPath = scopeToActions((state, action: COLLAPSE_ACTIONS_PATH_ACTION) => {
	if (action.type === COLLAPSE_ACTIONS_PATH) {
		return action.path;
	}
	return state;
}, collapsedPathActions, () => []);

const checkedPathActions = {
	CHECK_ACTIONS_PATH: checkActionsPath,
};

const checkedPath = scopeToActions((state, action: CHECK_ACTIONS_PATH_ACTION) => {
	if (action.type === CHECK_ACTIONS_PATH) {
		return action.path;
	}
	return state;
}, checkedPathActions, () => []);

export type ACTIONS_ACTION = COLLAPSE_ACTIONS_PATH_ACTION | CHECK_ACTIONS_PATH_ACTION;

export const actionsActions = {
	...collapsedPathActions,
	...checkedPathActions,
};

const initialActionsState = () => ({
	collapsedPath: collapsedPath(undefined, { type: '' }),
	checkedPath: checkedPath(undefined, { type: '' }),
});

const actions = scopeToActions((state: JSONChooserState, action: ACTIONS_ACTION) => ({
	collapsedPath: collapsedPath(state.collapsedPath, action),
	checkedPath: checkedPath(state.checkedPath, action),
}), actionsActions, initialActionsState);

export { actions };
