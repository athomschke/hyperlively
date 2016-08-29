import { TOGGLE_HANDWRITING_RECOGNITION } from 'constants/actionTypes';

function handwritingRecognition (state = false, action) {
	switch(action.type) {
	case TOGGLE_HANDWRITING_RECOGNITION:
		return action.bool;
	default:
		return state;
	}
}

export { handwritingRecognition };