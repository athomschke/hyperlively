import { undoable } from 'reducers/undoable';
import { sceneIndex } from 'reducers/sceneIndex';
import { scenes } from 'reducers/scenes';
import { defaultSceneIndex } from './defaultState';
import { ADD_SCENE, ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'constants/actionTypes';

const undoableScenes = undoable(scenes, {});

const defaultState = () => {
	return {
		sceneIndex: defaultSceneIndex,
		undoableScenes: undoableScenes(undefined, {})
	};
};

const combinedState = (state, action) => {
	return {
		sceneIndex: sceneIndex(state.sceneIndex, action),
		undoableScenes: undoableScenes(state.undoableScenes, action)
	};
};

function content (state = defaultState(), action) {
	switch(action.type) {
	case ADD_SCENE_AT:
		if ( action.index <= state.undoableScenes.present.length + 1 && action.index >= 0 ) {
			return combinedState(state, action);
		} else {
			return state;
		}
	case NEXT_SCENE:
		if ( state.sceneIndex < state.undoableScenes.present.length - 1 ) {
			return combinedState(state, action);
		} else {
			return {
				sceneIndex: sceneIndex(state.sceneIndex, action),
				undoableScenes: undoableScenes(state.undoableScenes, {
					type: ADD_SCENE
				})
			};
		}
	case SET_SCENE_INDEX:
		action.max = state.undoableScenes.present.length - 1;
		return combinedState(state, action);
	default:
		action.sceneIndex = state.sceneIndex;
		return combinedState(state, action);
	}
}

export { content };