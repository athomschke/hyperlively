// @flow
import { TOGGLE_DRAWING } from 'constants/actionTypes';
import { type TOGGLE_DRAWING_ACTION } from 'actionTypeDefinitions';

function drawing(state: boolean = false, action: TOGGLE_DRAWING_ACTION) {
	switch (action.type) {
	case TOGGLE_DRAWING:
		return action.boolean;
	default:
		return state;
	}
}

export { drawing };
