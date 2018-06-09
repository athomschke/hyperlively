// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleDrawing } from 'src/client/app/actions/drawing';
import { TOGGLE_DRAWING } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_DRAWING_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialDrawingState = () => false;

const drawingActions = [toggleDrawing];

const drawing = scopeToActions(
(state: boolean = initialDrawingState(), action: TOGGLE_DRAWING_ACTION) => {
	switch (action.type) {
	case TOGGLE_DRAWING:
		return action.boolean;
	default:
		return state;
	}
}, drawingActions);

export { drawing };
