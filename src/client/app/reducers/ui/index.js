// @flow
import type { UiState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { actionsActions, actions, type ACTIONS_ACTION } from 'src/client/app/reducers/ui/actions';
import { parametersActions, parameters, type PARAMETERS_ACTION } from 'src/client/app/reducers/ui/parameters';
import { interpretationsActions, interpretations, type INTERPRETATIONS_ACTION } from 'src/client/app/reducers/ui/interpretations';

type UI_ACIONS = PARAMETERS_ACTION | ACTIONS_ACTION | INTERPRETATIONS_ACTION;

const uiActions = {
	...parametersActions,
	...actionsActions,
	...interpretationsActions,
};

const initialUiState = () => ({
	actions: actions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
	interpretations: interpretations(undefined, { type: '' }),
});

const ui = scopeToActions((state: UiState, action: UI_ACIONS) => ({
	actions: actions(state.actions, action),
	parameters: parameters(state.parameters, action),
	interpretations: interpretations(state.interpretations, action),
}), uiActions, initialUiState);

export { ui };
