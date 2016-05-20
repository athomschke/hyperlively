import sketches from 'reducers/sketches'
import undoable, { distinctState } from 'redux-undo';
import * as actionTypes from 'constants/actionTypes';

const scene = (state = { sketches: [] }, action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
			return {
				sketches: sketches(state.sketches, action)
			};
		default:
			return state;
	}
}

const undoableScene = undoable(scene, {})

export default undoableScene;