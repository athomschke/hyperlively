// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { toggleHandwritingRecognition } from 'src/client/app/actions/configuring';
import { TOGGLE_HANDWRITING_RECOGNITION } from 'src/client/app/constants/actionTypes';
import { type TOGGLE_HANDWRITING_RECOGNITION_ACTION } from 'src/client/app/actionTypeDefinitions';

export const initialHandwritingRecognitionState = () => true;

const handwritingRecognitionAction = [toggleHandwritingRecognition];

const handwritingRecognition = scopeToActions(
(state: boolean = initialHandwritingRecognitionState(),
		action: TOGGLE_HANDWRITING_RECOGNITION_ACTION) => {
	switch (action.type) {
	case TOGGLE_HANDWRITING_RECOGNITION:
		return action.boolean;
	default:
		return state;
	}
}, handwritingRecognitionAction);

export { handwritingRecognition };
