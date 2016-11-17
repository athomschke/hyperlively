import { undoable } from 'reducers/undoable';
import { sceneIndex } from 'reducers/sceneIndex';
import { scenes } from 'reducers/scenes';
import { APPEND_POINT, CREATE_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, ADD_SCENE, ADD_SCENE_AT, SET_SCENE_INDEX } from 'constants/actionTypes';

const undoableScenes = undoable(scenes, {});

const defaultState = () => {
	return {
		sceneIndex: 0,
		undoableScenes: undoableScenes(undefined, {})
	};
};

function content (state = defaultState(), action) {
	switch(action.type) {
	case ADD_SCENE_AT:
		if ( action.index <= state.undoableScenes.present.length + 1 && action.index >= 0 ) {
			return {
				sceneIndex: state.sceneIndex,
				undoableScenes: undoableScenes(state.undoableScenes, action)
			};
		} else {
			return state;
		}
	case ADD_SCENE:
	case APPEND_POINT:
	case CREATE_STROKE:
	case FINISH_STROKE:
	case HIDE:
	case UPDATE_POSITION:
	case SET_SCENE_INDEX:
		action.sceneIndex = state.sceneIndex;
		action.max = state.undoableScenes.present.length - 1;
		return {
			sceneIndex: sceneIndex(state.sceneIndex, action),
			undoableScenes: undoableScenes(state.undoableScenes, action)
		};
	default:
		return {
			sceneIndex: sceneIndex(state.sceneIndex, action),
			undoableScenes: undoableScenes(state.undoableScenes, action)
		};
	}
}

export { content };