import { scenes } from 'reducers/scenes'
import { undoable } from 'reducers/undoable'
import { threshold } from 'reducers/threshold'
import { ploma } from 'reducers/ploma'
import { DEFAULT_THRESHOLD } from 'constants/drawing'
import { combineReducers } from 'redux';

const undoableScenes = undoable(scenes, {});

const hyperlively = combineReducers({
	ploma,
	undoableScenes,
	threshold
})

export default hyperlively;