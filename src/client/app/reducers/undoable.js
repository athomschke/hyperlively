import { concat, slice, isEqual, cloneDeep } from 'lodash';
import { JUMP_TO } from 'constants/actionTypes';
import relevantStatesForScene from 'helpers/relevantStatesForScene';

function undoable(reducer) {
	const initialState = {
		past: [],
		present: reducer(undefined, {}),
		future: [],
	};

	const nextState = (pointInTime, past, present, future, sceneIndex) => {
		const allStates = concat(past, [present], future);
		const relevantStates = relevantStatesForScene(allStates, sceneIndex);
		const normalizedPointInTime = Math.min(relevantStates.length - 1, Math.max(0, pointInTime));
		const globalPointInTime = allStates.indexOf(relevantStates[normalizedPointInTime]);
		return {
			past: slice(allStates, 0, globalPointInTime),
			present: slice(allStates, globalPointInTime, globalPointInTime + 1)[0],
			future: slice(allStates, globalPointInTime + 1, allStates.length),
		};
	};

	const defaultNextState = (state, action) => {
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

	return (state = initialState, action) => {
		const { past, present, future } = state;

		switch (action.type) {
		case JUMP_TO: {
			return nextState(action.pointInTime, past, present, future, action.sceneIndex);
		}
		default:
			return defaultNextState(state, action);
		}
	};
}

export { undoable };
