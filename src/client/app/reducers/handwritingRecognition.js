// @flow
import { TOGGLE_HANDWRITING_RECOGNITION } from 'constants/actionTypes';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from 'actionTypeDefinitions';
import { defaultHandwritingRecognition } from './defaultState';

function handwritingRecognition(state: boolean = defaultHandwritingRecognition,
		action: TOGGLE_HANDWRITING_RECOGNITION_ACTION) {
	switch (action.type) {
	case TOGGLE_HANDWRITING_RECOGNITION:
		return action.boolean;
	default:
		return state;
	}
}

export { handwritingRecognition };
