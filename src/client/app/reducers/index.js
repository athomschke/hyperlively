import { combineReducers } from 'redux';
import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { drawing } from './drawing';
import { content } from './content';

export default combineReducers({
	ploma,
	handwritingRecognition,
	observeMutations,
	threshold,
	drawing,
	content,
});
