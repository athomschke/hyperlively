// @flow
import { EXPAND_PARAMETERS_PATH } from 'src/constants/actionTypes';
import type { EXPAND_PARAMETERS_PATH_ACTION, CHECK_PARAMETERS_PATH_ACTION } from 'src/actionTypeDefinitions';
import { collapseParametersPath } from 'src/actionCreators';
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

export type PARAMETERS_ACTION = EXPAND_PARAMETERS_PATH_ACTION | CHECK_PARAMETERS_PATH_ACTION;

export const parametersActions = {
	...expandedPathActions,
};

const initialParametersState = () => ({
	expandedPath: expandedPath(undefined, { type: '' }),
});

const parameters = scopeToActions((state: JSONChooserState, action: PARAMETERS_ACTION) => ({
	expandedPath: expandedPath(state.expandedPath, action),
}), parametersActions, initialParametersState);

export { parameters };
