// @flow
import { ADD_SCENE, ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'constants/actionTypes';
import { type Content } from 'typeDefinitions';
import type {
	ADD_SCENE_AT_ACTION, NEXT_SCENE_ACTION, SET_SCENE_INDEX_ACTION,
	APPEND_POINT_ACTION, APPEND_STROKE_ACTION, FINISH_STROKE_ACTION,
	HIDE_ACTION, SELECT_ACTION, SELECT_INSIDE_ACTION, UPDATE_POSITION_ACTION,
	ADD_SCENE_ACTION,
} from 'actionTypeDefinitions';
import { undoable } from './undoable';
import { sceneIndex } from './sceneIndex';
import { scenes } from './scenes';
import { defaultSceneIndex } from './defaultState';

const undoableScenes = undoable(scenes);

const defaultState = () => ({
	sceneIndex: defaultSceneIndex,
	undoableScenes: undoableScenes(undefined, { type: undefined }),
});

const combinedState = (state: Content = defaultState(), action) => ({
	sceneIndex: sceneIndex(state.sceneIndex, action),
	undoableScenes: undoableScenes(state.undoableScenes, action),
});

function content(state: Content = defaultState(), action:
		ADD_SCENE_AT_ACTION | NEXT_SCENE_ACTION | SET_SCENE_INDEX_ACTION |
		APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
		HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION | UPDATE_POSITION_ACTION |
		ADD_SCENE_ACTION) {
	switch (action.type) {
	case ADD_SCENE_AT:
		if (action.number <= state.undoableScenes.present.length + 1 && action.number >= 0) {
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
