// @flow
import scopeToActions from 'src/reducers/scopeToActions';
import { toggleHandwritingRecognition } from 'src/actionCreators';
import { TOGGLE_HANDWRITING_RECOGNITION } from 'src/constants/actionTypes';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from 'src/actionTypeDefinitions';

const initialHandwritingRecognitionState = () => true;

export type HANDWRITING_RECOGNITION_ACTION = TOGGLE_HANDWRITING_RECOGNITION_ACTION;

export const handwritingRecognitionActions = {
	TOGGLE_HANDWRITING_RECOGNITION: toggleHandwritingRecognition,
};

const handwritingRecognition = scopeToActions(
	(state: boolean, action: HANDWRITING_RECOGNITION_ACTION) => {
		switch (action.type) {
		case TOGGLE_HANDWRITING_RECOGNITION:
			return action.boolean;
		default:
			return state;
		}
	}, handwritingRecognitionActions, initialHandwritingRecognitionState,
);

export { handwritingRecognition };
