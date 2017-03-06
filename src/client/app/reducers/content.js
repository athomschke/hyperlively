import { undoable } from './undoable';
import { sceneIndex } from './sceneIndex';
import { scenes } from './scenes';
import { defaultSceneIndex } from './defaultState';
import { ADD_SCENE, ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'constants/actionTypes';

const undoableScenes = undoable(scenes, {});

const defaultState = () => ({
	sceneIndex: defaultSceneIndex,
	undoableScenes: undoableScenes(undefined, {}),
});

const combinedState = (state, action) => ({
	sceneIndex: sceneIndex(state.sceneIndex, action),
	undoableScenes: undoableScenes(state.undoableScenes, action),
});

function content(state = defaultState(), action) {
	switch (action.type) {
	case ADD_SCENE_AT:
		if (action.index <= state.undoableScenes.present.length + 1 && action.index >= 0) {
			return combinedState(state, action);
		}
		return state;
	case NEXT_SCENE:
		if (state.sceneIndex < state.undoableScenes.present.length - 1) {
			return combinedState(state, action);
		}
		return {
			sceneIndex: sceneIndex(state.sceneIndex, action),
			undoableScenes: undoableScenes(state.undoableScenes, {
				type: ADD_SCENE,
			}),
		};
	case SET_SCENE_INDEX:
		return combinedState(state, Object.assign({}, action, {
			max: state.undoableScenes.present.length - 1,
		}));
	default:
		return combinedState(state, Object.assign({}, action, {
			sceneIndex: state.sceneIndex,
		}));
	}
}

export { content };
