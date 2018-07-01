// @flow
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import { addScene } from 'src/client/app/actionCreators';
import { ADD_SCENE_AT, SET_SCENE_INDEX, NEXT_SCENE } from 'src/client/app/constants/actionTypes';
import { type Data, type UndoableScenes } from 'src/client/app/types';

import { undoable, undoableActions, type UndoableActionType } from './undoable';
import { sceneIndex, setSceneIndexActions, type SetSceneActionType } from './sceneIndex';
import { scenes, scenesActions, type ScenesActionType } from './scenes';
import { interpretation, interpretationActions, type INTERPRETATION_ACTION } from './interpretation';
import { specificActions, specificActionsActions, type SPECIFIG_ACTIONS_ACTION } from './specificActions';

type UndoableSceneActionType = UndoableActionType<ScenesActionType | SetSceneActionType>

type DataActionType = UndoableSceneActionType | INTERPRETATION_ACTION | SPECIFIG_ACTIONS_ACTION

const undoableScenes = undoable(scenes, scenesActions);

export const dataActions = {
	...specificActionsActions,
	...setSceneIndexActions,
	...interpretationActions,
	...undoableActions(scenesActions),
	...scenesActions,
};

const initialUndoableScenes = (): UndoableScenes => ({
	past: [],
	present: scenes(undefined, { type: '' }),
	future: [],
});

const initialDataState = (): Data => ({
	sceneIndex: 0,
	interpretation: interpretation(undefined, { type: '' }),
	specificActions: specificActions(undefined, { type: '' }),
	scenes: initialUndoableScenes(),
});

type DataReducer = (state: Data, action: DataActionType) => Data

const scopedData: DataReducer = (state, action) => {
	switch (action.type) {
	case ADD_SCENE_AT:
		if (action.number <= state.scenes.present.length + 1 && action.number >= 0) {
			return {
				...state,
				scenes: undoableScenes(state.scenes, action),
			};
		}
		return state;
	case NEXT_SCENE:
		if (state.sceneIndex < state.scenes.present.length - 1) {
			return {
				...state,
				sceneIndex: sceneIndex(state.sceneIndex, action),
				scenes: state.scenes,
			};
		}
		return {
			...state,
			sceneIndex: sceneIndex(state.sceneIndex, action),
			scenes: undoableScenes(state.scenes, addScene()),
		};
	case SET_SCENE_INDEX: {
		const setSceneIndexAction = {
			...action,
			max: state.scenes.present.length - 1,
			action,
		};
		return {
			...state,
			sceneIndex: sceneIndex(state.sceneIndex, setSceneIndexAction),
			scenes: state.scenes,
		};
	}
	default:
		if (Object.keys(setSceneIndexActions).indexOf(action.type) >= 0) {
			return {
				...state,
				sceneIndex: sceneIndex(state.sceneIndex, action),
			};
		} else if (Object.keys(undoableActions(scenesActions)).indexOf(action.type) >= 0) {
			const undoableScenesAction: UndoableSceneActionType = (action: any);
			undoableScenesAction.sceneIndex = state.sceneIndex;
			return {
				...state,
				scenes: undoableScenes(state.scenes, undoableScenesAction),
			};
		} else if (Object.keys(dataActions).indexOf(action.type) >= 0) {
			return {
				...state,
				interpretation: interpretation(state.interpretation, action),
				specificActions: specificActions(state.specificActions, action),
			};
		}
		return state;
	}
};

const data = scopeToActions(scopedData, dataActions, initialDataState);

export { data };
