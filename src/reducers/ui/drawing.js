// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { toggleDrawing } from 'src/actionCreators';
import { TOGGLE_DRAWING } from 'src/constants/actionTypes';
import { type TOGGLE_DRAWING_ACTION } from 'src/actionTypeDefinitions';

const initialDrawingState = () => false;

export type DRAWING_ACTION = TOGGLE_DRAWING_ACTION;

export const drawingActions = {
	TOGGLE_DRAWING: toggleDrawing,
};

const drawing = scopeToActions((state: boolean, action: DRAWING_ACTION) => {
	switch (action.type) {
	case TOGGLE_DRAWING:
		return action.boolean;
	default:
		return state;
	}
}, drawingActions, initialDrawingState);

export { drawing };
