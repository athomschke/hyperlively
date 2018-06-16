// @flow
import type { UiState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { actionsActions, actions, type ACTIONS_ACTION } from 'src/client/app/reducers/ui/actions';
import { parametersActions, parameters, type PARAMETERS_ACTION } from 'src/client/app/reducers/ui/parameters';

type UI_ACIONS = PARAMETERS_ACTION | ACTIONS_ACTION;

const uiActions = {
	...parametersActions,
	...actionsActions,
};

const initialUiState = () => ({
	actions: actions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
});

const ui = scopeToActions((state: UiState, action: UI_ACIONS) => ({
	actions: actions(state.actions, action),
	parameters: parameters(state.parameters, action),
}), uiActions, initialUiState);

export { ui };
