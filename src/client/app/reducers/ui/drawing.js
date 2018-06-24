// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleDrawing } from 'src/client/app/actionCreators';
import { TOGGLE_DRAWING } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_DRAWING_ACTION } from 'src/client/app/actionTypeDefinitions';

const initialDrawingState = () => false;

export const drawingActions = {
	TOGGLE_DRAWING: toggleDrawing,
};

const drawing = scopeToActions((state: boolean, action: TOGGLE_DRAWING_ACTION) => {
	switch (action.type) {
	case TOGGLE_DRAWING:
		return action.boolean;
	default:
		return state;
	}
}, drawingActions, initialDrawingState);

export { drawing };