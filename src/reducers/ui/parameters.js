// @flow
import { without } from 'lodash';

import { EXPAND_PARAMETERS_PATH, CHECK_PARAMETERS_PATH, SELECT } from 'src/constants/actionTypes';
import type { EXPAND_PARAMETERS_PATH_ACTION, CHECK_PARAMETERS_PATH_ACTION } from 'src/actionTypeDefinitions';
import { type StrokeActionType, strokeActions } from 'src/reducers/data/strokes/stroke';
import { collapseParametersPath, checkParametersPath } from 'src/actionCreators';
import type { JSONChooserState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

const expandedPathActions = {
	EXPAND_PARAMETERS_PATH: collapseParametersPath,
};

const expandedPath = scopeToActions((state, action: EXPAND_PARAMETERS_PATH_ACTION) => {
	if (action.type === EXPAND_PARAMETERS_PATH) {
		return action.path;
	}
	return state;
}, expandedPathActions, () => []);

const checkedPathActions = {
	...strokeActions,
	CHECK_PARAMETERS_PATH: checkParametersPath,
};

type CHECKED_PATH_ACTIONS = CHECK_PARAMETERS_PATH_ACTION | StrokeActionType;

const checkedPath = scopeToActions((state, action: CHECKED_PATH_ACTIONS) => {
	if (without(Object.keys(strokeActions), SELECT).includes(action.type)) {
		return [];
	}
	if (action.type === CHECK_PARAMETERS_PATH) {
		return action.path;
	}
	return state;
}, checkedPathActions, () => []);

export type PARAMETERS_ACTION = EXPAND_PARAMETERS_PATH_ACTION | CHECKED_PATH_ACTIONS;

export const parametersActions = {
	...expandedPathActions,
	...checkedPathActions,
};

const initialParametersState = () => ({
	expandedPath: expandedPath(undefined, { type: '' }),
	checkedPath: checkedPath(undefined, { type: '' }),
});

const parameters = scopeToActions((state: JSONChooserState, action: PARAMETERS_ACTION) => ({
	expandedPath: expandedPath(state.expandedPath, action),
	checkedPath: checkedPath(state.checkedPath, action),
}), parametersActions, initialParametersState);

export { parameters };
