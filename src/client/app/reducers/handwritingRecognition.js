// @flow
import { TOGGLE_HANDWRITING_RECOGNITION } from 'constants/actionTypes';
import { defaultHandwritingRecognition } from './defaultState';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from '../actionTypeDefinitions';

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
