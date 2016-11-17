import { threshold } from 'reducers/threshold';
import { ploma } from 'reducers/ploma';
import { handwritingRecognition } from 'reducers/handwritingRecognition';
import { observeMutations } from 'reducers/observeMutations';
import { drawing } from 'reducers/drawing';
import { content } from 'reducers/content';
import { combineReducers } from 'redux';

export default combineReducers({
	ploma,
	handwritingRecognition,
	observeMutations,
	threshold,
	drawing,
	content
});