// @flow
import { concat, slice, isEqual, cloneDeep } from 'lodash';

import { JUMP_TO } from 'src/client/app/constants/actionTypes';
import { jumpTo } from 'src/client/app/actionCreators';
import relevantStatesForScene from 'src/client/app/helpers/relevantStatesForScene';
import type { UndoableScenes, SceneState } from 'src/client/app/typeDefinitions';
import { scenesActions } from 'src/client/app/reducers/content/scenes';
import { type JUMP_TO_ACTION } from 'src/client/app/actionTypeDefinitions';

export type UndoableActionType<T> = T | JUMP_TO_ACTION;

export const undoableActions = {
	...scenesActions,
	JUMP_TO: jumpTo,
};

type Reducer = (state: any, action: { type: string, [key: string]: any }) => any

const undoable = (reducer: Reducer) => {
	const myPresent: SceneState = reducer(undefined, { type: '' });
	const initialState = () => ({
		past: [],
		present: myPresent,
		future: [],
	});

	const nextState = (
			pointInTime: number,
			past: Array<SceneState>,
			present: SceneState,
			future: Array<SceneState>,
			sceneIndex: number) => {
		const allStates: Array<SceneState> = concat(past, [present], future);
		const relevantStates = relevantStatesForScene(allStates, sceneIndex);
		const normalizedPointInTime = Math.min(relevantStates.length - 1, Math.max(0, pointInTime));
		const globalPointInTime = allStates.indexOf(relevantStates[normalizedPointInTime]);
		return {
			past: slice(allStates, 0, globalPointInTime),
			present: slice(allStates, globalPointInTime, globalPointInTime + 1)[0],
			future: slice(allStates, globalPointInTime + 1, allStates.length),
		};
	};

	const defaultNextState = (state: UndoableScenes, action) => {
		const passedAction = Object.assign({}, action, {
			index: state.past.length,
		});
		const newPresent = reducer(cloneDeep(state.present), passedAction);
		if (isEqual(state.present, newPresent)) {
			return state;
		}
		return {
			past: concat(state.past, [state.present]),
			present: newPresent,
			future: state.future,
		};
	};

	return (state: UndoableScenes = initialState(), action: UndoableActionType<any>) => {
		const { past, present, future } = state;

		switch (action.type) {
		case JUMP_TO: {
			return nextState(action.pointInTime, past, present, future, action.sceneIndex);
		}
		default:
			return defaultNextState(state, action);
		}
	};
};

export { undoable };
