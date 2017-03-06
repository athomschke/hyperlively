import { TOGGLE_HANDWRITING_RECOGNITION } from 'constants/actionTypes';
import { defaultHandwritingRecognition } from './defaultState';

function handwritingRecognition(state = defaultHandwritingRecognition, action) {
	switch (action.type) {
	case TOGGLE_HANDWRITING_RECOGNITION:
		return action.bool;
	default:
		return state;
	}
}

export { handwritingRecognition };
