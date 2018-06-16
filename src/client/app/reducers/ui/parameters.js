// @flow
import { COLLAPSE_PARAMETERS_PATH, CHECK_PARAMETERS_PATH } from 'src/client/app/constants/actionTypes';
import type { COLLAPSE_PARAMETERS_PATH_ACTION, CHECK_PARAMETERS_PATH_ACTION } from 'src/client/app/actionTypeDefinitions';
import { collapseParametersPath, checkParametersPath } from 'src/client/app/actionCreators';
import type { JSONChooserState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';

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
	CHECK_PARAMETERS_PATH: checkParametersPath,
};

const checkedPath = scopeToActions((state, action: CHECK_PARAMETERS_PATH_ACTION) => {
	if (action.type === CHECK_PARAMETERS_PATH) {
		return action.path;
	}
	return state;
}, checkedPathActions, () => []);

export type PARAMETERS_ACTION = COLLAPSE_PARAMETERS_PATH_ACTION | CHECK_PARAMETERS_PATH_ACTION;

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
