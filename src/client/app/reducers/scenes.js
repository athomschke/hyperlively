import sketches from 'reducers/sketches'
import undoable, { distinctState } from 'redux-undo';
import * as actionTypes from 'constants/actionTypes';
import { last } from 'lodash';

let defaultScene = () => {
	return {
		sketches: []
	}
}

const scenes = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
		case actionTypes.FINISH_STROKE:
			return [{
				sketches: sketches((last(state) || defaultScene()).sketches, action)
			}];
		default:
			return state;
	}
}

const undoableScene = undoable(scenes, {})

export default undoableScene;