// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { addScene } from 'src/client/app/actionCreators';
import { ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'src/client/app/constants/actionTypes';
import { type Content, type UndoableScenes } from 'src/client/app/typeDefinitions';

import { undoable, undoableActions, type UndoableActionType } from './undoable';
import { sceneIndex, setSceneIndexActions, type SetSceneActionType } from './sceneIndex';
import { scenes, scenesActions, type ScenesActionType } from './scenes';

type UndoableSceneActionType = UndoableActionType<ScenesActionType | SetSceneActionType>

const undoableScenes = undoable(scenes, scenesActions);

export const undoableScenesActions = {
	...setSceneIndexActions,
	...undoableActions(scenesActions),
	...scenesActions,
};

const initialUndoableScenes = (): UndoableScenes => ({
	past: [],
	present: scenes(undefined, { type: '' }),
	future: [],
});

const initialContentState = (): Content => ({
	sceneIndex: 0,
	undoableScenes: initialUndoableScenes(),
});

type ContentReducer = (state: Content, action: UndoableSceneActionType) => Content

const scopedContent: ContentReducer = (state, action) => {
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
		const setSceneIndexAction = {
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
		if (Object.keys(setSceneIndexActions).indexOf(action.type) >= 0) {
			return {
				...state,
				sceneIndex: sceneIndex(state.sceneIndex, action),
			};
		} else if (Object.keys(undoableActions(scenesActions)).indexOf(action.type) >= 0) {
			const undoableScenesAction: UndoableSceneActionType = action;
			undoableScenesAction.sceneIndex = state.sceneIndex;
			return {
				...state,
				undoableScenes: undoableScenes(state.undoableScenes, undoableScenesAction),
			};
		}
		return state;
	}
};

const content = scopeToActions(scopedContent, undoableScenesActions, initialContentState);

export { content };
