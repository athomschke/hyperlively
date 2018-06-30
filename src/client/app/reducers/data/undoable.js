// @flow
import { concat, slice } from 'lodash';

import { JUMP_TO } from 'src/client/app/constants/actionTypes';
import { MAX_AGE } from 'src/client/app/constants/configuration';
import { jumpTo } from 'src/client/app/actionCreators';
import scopeToActions from 'src/client/app/reducers/scopeToActions';
import type { Reducer } from 'src/client/app/typeDefinitions';
import { type JUMP_TO_ACTION } from 'src/client/app/actionTypeDefinitions';

export type UndoableActionType<T> = T | JUMP_TO_ACTION;

export const undoableActions = (undoableDataActions: *) => ({
	...undoableDataActions,
	JUMP_TO: jumpTo,
});

type UndoableState<T> = {
	past: Array<T>,
	present: T,
	future: Array<T>,
}

type UndoableReducer<T> = (state: T, action: UndoableActionType<T>) => UndoableState<T>

type Undoable<T> = (reducer: Reducer, wrappedActions: { [key: string]: any }) => UndoableReducer<T>

const startPoint = currentPoint => Math.max(0, currentPoint - MAX_AGE);

const nextState = (pointInTime, past, present, future) => {
	const allStates = concat(past, [present], future);
	const normalizedPointInTime = Math.min(allStates.length - 1, Math.max(0, pointInTime));
	const globalPointInTime = allStates.indexOf(allStates[normalizedPointInTime]);
	return {
		past: slice(allStates, startPoint(globalPointInTime), globalPointInTime),
		present: slice(allStates, globalPointInTime, globalPointInTime + 1)[0],
		future: slice(allStates, globalPointInTime + 1, allStates.length),
	};
};

const undoable: Undoable<any> = (reducer, wrappedActions) => {
	const initialState = () => ({
		past: [],
		present: reducer(undefined, { type: '' }),
		future: [],
	});

	const defaultNextState = (state, action) => {
		const passedAction = Object.assign({}, action, {
			index: state.past.length,
		});
		const fullPast = concat(state.past, [state.present]);
		const past = slice(fullPast, startPoint(fullPast.length), fullPast.length);
		const present = reducer(state.present, passedAction);
		return {
			past,
			present,
			future: state.future,
		};
	};

	return scopeToActions((state, action) => {
		const { past, present, future } = state;

		switch (action.type) {
		case JUMP_TO: {
			return nextState(action.pointInTime, past, present, future);
		}
		default:
			return defaultNextState(state, action);
		}
	}, undoableActions(wrappedActions), initialState);
};

export { undoable };
