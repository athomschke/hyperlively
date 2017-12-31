// @flow
import { TOGGLE_DRAWING } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_DRAWING_ACTION } from 'src/client/app/actionTypeDefinitions';

function drawing(state: boolean = false, action: TOGGLE_DRAWING_ACTION) {
	switch (action.type) {
	case TOGGLE_DRAWING:
		return action.boolean;
	default:
		return state;
	}
}

export { drawing };
