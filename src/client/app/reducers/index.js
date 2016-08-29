import { scenes } from 'reducers/scenes';
import { undoable } from 'reducers/undoable';
import { threshold } from 'reducers/threshold';
import { ploma } from 'reducers/ploma';
import { handwritingRecognition } from 'reducers/handwritingRecognition';
import { drawing } from 'reducers/drawing';
import { combineReducers } from 'redux';

const undoableScenes = undoable(scenes, {});

export default combineReducers({
	ploma,
	handwritingRecognition,
	undoableScenes,
	threshold,
	drawing
});