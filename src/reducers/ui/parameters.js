// @flow
import { COLLAPSE_PARAMETERS_PATH, CHECK_PARAMETERS_PATH } from 'src/constants/actionTypes';
import type { COLLAPSE_PARAMETERS_PATH_ACTION, CHECK_PARAMETERS_PATH_ACTION } from 'src/actionTypeDefinitions';
import { type StrokeActionType, strokeActions } from 'src/reducers/data/strokes/stroke';
import { collapseParametersPath, checkParametersPath } from 'src/actionCreators';
import type { JSONChooserState } from 'src/types';
import scopeToActions from 'src/reducers/scopeToActions';

const collapsedPathActions = {
	COLLAPSE_PARAMETERS_PATH: collapseParametersPath,
};

const collapsedPath = scopeToActions((state, action: COLLAPSE_PARAMETERS_PATH_ACTION) => {
	if (action.type === COLLAPSE_PARAMETERS_PATH) {
		return action.path;
	}
	return state;
}, collapsedPathActions, () => []);

const checkedPathActions = {
	...strokeActions,
	CHECK_PARAMETERS_PATH: checkParametersPath,
};

type CHECKED_PATH_ACTIONS = CHECK_PARAMETERS_PATH_ACTION | StrokeActionType;

const checkedPath = scopeToActions((state, action: CHECKED_PATH_ACTIONS) => {
	if (Object.keys(strokeActions).includes(action.type)) {
		return [];
	}
	if (action.type === CHECK_PARAMETERS_PATH) {
		return action.path;
	}
	return state;
}, checkedPathActions, () => []);

export type PARAMETERS_ACTION = COLLAPSE_PARAMETERS_PATH_ACTION | CHECKED_PATH_ACTIONS;

export const parametersActions = {
	...collapsedPathActions,
	...checkedPathActions,
};

const initialParametersState = () => ({
	collapsedPath: collapsedPath(undefined, { type: '' }),
	checkedPath: checkedPath(undefined, { type: '' }),
});

const parameters = scopeToActions((state: JSONChooserState, action: PARAMETERS_ACTION) => ({
	collapsedPath: collapsedPath(state.collapsedPath, action),
	checkedPath: checkedPath(state.checkedPath, action),
}), parametersActions, initialParametersState);

export { parameters };
