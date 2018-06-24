// @flow
import type { UiState } from 'src/client/app/typeDefinitions';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { actionsActions, actions, type ACTIONS_ACTION } from 'src/client/app/reducers/ui/actions';
import { parametersActions, parameters, type PARAMETERS_ACTION } from 'src/client/app/reducers/ui/parameters';
import { interpretationsActions, interpretations, type INTERPRETATIONS_ACTION } from 'src/client/app/reducers/ui/interpretations';
import { drawing, drawingActions, type DRAWING_ACTION } from 'src/client/app/reducers/ui/drawing';
import { handwritingRecognition, handwritingRecognitionActions, type HANDWRITING_RECOGNITION_ACTION } from 'src/client/app/reducers/ui/handwritingRecognition';
import { observeMutations, observeMutationsActions } from 'src/client/app/reducers/ui/observeMutations';
import { type OBSERVE_MUTATIONS_ACTION } from 'src/client/app/actionTypeDefinitions';
import { ploma, plomaActions, type PLOMA_ACTION } from 'src/client/app/reducers/ui/ploma';

type UI_ACIONS = PARAMETERS_ACTION | ACTIONS_ACTION | INTERPRETATIONS_ACTION |
	PLOMA_ACTION | DRAWING_ACTION | HANDWRITING_RECOGNITION_ACTION | OBSERVE_MUTATIONS_ACTION;

const uiActions = {
	...plomaActions,
	...observeMutationsActions,
	...drawingActions,
	...handwritingRecognitionActions,
	...parametersActions,
	...actionsActions,
	...interpretationsActions,
};

const initialUiState = () => ({
	ploma: ploma(undefined, { type: '' }),
	actions: actions(undefined, { type: '' }),
	parameters: parameters(undefined, { type: '' }),
	drawing: drawing(undefined, { type: '' }),
	observeMutations: observeMutations(undefined, { type: '' }),
	handwritingRecognition: handwritingRecognition(undefined, { type: '' }),
	interpretations: interpretations(undefined, { type: '' }),
});

const ui = scopeToActions((state: UiState, action: UI_ACIONS) => ({
	ploma: ploma(state.ploma, action),
	actions: actions(state.actions, action),
	parameters: parameters(state.parameters, action),
	observeMutations: observeMutations(state.observeMutations, action),
	drawing: drawing(state.drawing, action),
	handwritingRecognition: handwritingRecognition(state.handwritingRecognition, action),
	interpretations: interpretations(state.interpretations, action),
}), uiActions, initialUiState);

export { ui };
