// @flow
import { TOGGLE_HANDWRITING_RECOGNITION } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialHandwritingRecognitionState = () => true;

function handwritingRecognition(state: boolean = initialHandwritingRecognitionState(),
		action: TOGGLE_HANDWRITING_RECOGNITION_ACTION) {
	switch (action.type) {
	case TOGGLE_HANDWRITING_RECOGNITION:
		return action.boolean;
	default:
		return state;
	}
}

export { handwritingRecognition };
