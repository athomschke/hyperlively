import { combineReducers } from 'redux';
import { threshold } from './threshold';
import { ploma } from './ploma';
import { handwritingRecognition } from './handwritingRecognition';
import { observeMutations } from './observeMutations';
import { interpretation } from './interpretation';
import { drawing } from './drawing';
import { content } from './content';

export default combineReducers({
	interpretation,
	ploma,
	handwritingRecognition,
	observeMutations,
	threshold,
	drawing,
	content,
});
