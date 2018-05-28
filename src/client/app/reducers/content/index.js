// @flow
import { addScene } from 'src/client/app/actions/drawing';
import { ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'src/client/app/constants/actionTypes';
import { type SET_SCENE_INDEX_ACTION } from 'src/client/app/actionTypeDefinitions';
import { type Content } from 'src/client/app/typeDefinitions';

import { undoable, undoableActionTypes, type UndoableActionType } from './undoable';
import { sceneIndex, sceneIndexActionTypes, type SetSceneActionType, type SafeSetSceneActionType } from './sceneIndex';
import { scenes, scenesActionTypes, initialScenesState, type ScenesActionType } from './scenes';
import { defaultSceneIndex } from './defaultState';

type UndoableSceneActionType = UndoableActionType<ScenesActionType | SetSceneActionType>

const undoableScenes = undoable(scenes);

const undoableScenesActionTypes = [...undoableActionTypes, ...scenesActionTypes];

const initialUndoableScenes = {
	past: [],
	present: initialScenesState,
	future: [],
};

export const initialContentState = () => ({
	sceneIndex: defaultSceneIndex,
	undoableScenes: initialUndoableScenes,
});

function content(state: Content = initialContentState(), action: UndoableSceneActionType) {
	switch (action.type) {
	case ADD_SCENE_AT:
		if (action.number <= state.undoableScenes.present.length + 1 && action.number >= 0) {
			return {
				...state,
				undoableScenes: undoableScenes(state.undoableScenes, action),
			};
		}
		return state;
	case NEXT_SCENE:
		if (state.sceneIndex < state.undoableScenes.present.length - 1) {
			return {
				sceneIndex: sceneIndex(state.sceneIndex, action),
				undoableScenes: state.undoableScenes,
			};
		}
		return {
			sceneIndex: sceneIndex(state.sceneIndex, action),
			undoableScenes: undoableScenes(state.undoableScenes, addScene()),
		};
	case SET_SCENE_INDEX: {
		const setSceneIndexAction: SET_SCENE_INDEX_ACTION = {
			...action,
			max: state.undoableScenes.present.length - 1,
			action,
		};
		return {
			sceneIndex: sceneIndex(state.sceneIndex, setSceneIndexAction),
			undoableScenes: state.undoableScenes,
		};
	}
	default:
		if (sceneIndexActionTypes.indexOf(action.type) >= 0) {
			const sceneIndexAction: SafeSetSceneActionType = ((action:any): SafeSetSceneActionType);
			return {
				...state,
				sceneIndex: sceneIndex(state.sceneIndex, sceneIndexAction),
			};
		} else if (undoableScenesActionTypes.indexOf(action.type) >= 0) {
			const undoableScenesAction: UndoableSceneActionType = action;
			return {
				...state,
				undoableScenes: undoableScenes(state.undoableScenes, undoableScenesAction),
			};
		}
		return state;
	}
}

export { content };
