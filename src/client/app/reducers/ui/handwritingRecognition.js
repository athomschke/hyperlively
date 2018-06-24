// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleHandwritingRecognition } from 'src/client/app/actionCreators';
import { TOGGLE_HANDWRITING_RECOGNITION } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from 'src/client/app/actionTypeDefinitions';

const initialHandwritingRecognitionState = () => true;

export const handwritingRecognitionActions = {
	TOGGLE_HANDWRITING_RECOGNITION: toggleHandwritingRecognition,
};

const handwritingRecognition = scopeToActions(
	(state: boolean, action: TOGGLE_HANDWRITING_RECOGNITION_ACTION) => {
		switch (action.type) {
		case TOGGLE_HANDWRITING_RECOGNITION:
			return action.boolean;
		default:
			return state;
		}
	}, handwritingRecognitionActions, initialHandwritingRecognitionState);

export { handwritingRecognition };