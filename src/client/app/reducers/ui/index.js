// @flow
import type { UiState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { actionsActions, actions, type ACTIONS_ACTION } from 'src/client/app/reducers/ui/actions';
import { parametersActions, parameters, type PARAMETERS_ACTION } from 'src/client/app/reducers/ui/parameters';
import { interpretationsActions, interpretations, type INTERPRETATIONS_ACTION } from 'src/client/app/reducers/ui/interpretations';
import { drawing } from 'src/client/app/reducers/ui/drawing';
import { handwritingRecognition } from 'src/client/app/reducers/ui/handwritingRecognition';
import { observeMutations } from 'src/client/app/reducers/ui/observeMutations';

type UI_ACIONS = PARAMETERS_ACTION | ACTIONS_ACTION | INTERPRETATIONS_ACTION;

const uiActions = {
	...parametersActions,
	...actionsActions,
	...interpretationsActions,
};

const initialUiState = () => ({
	actions: actions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
	drawing: drawing(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: '' }),
	interpretations: interpretations(undefined, { type: '' }),
});

const ui = scopeToActions((state: UiState, action: UI_ACIONS) => ({
	actions: actions(state.actions, action),
	parameters: parameters(state.parameters, action),
	observeMutations: observeMutations(state.observeMutations, action),
	drawing: drawing(state.drawing, action),
	handwritingRecognition: handwritingRecognition(state.handwritingRecognition, action),
	interpretations: interpretations(state.interpretations, action),
}), uiActions, initialUiState);

export { ui };
