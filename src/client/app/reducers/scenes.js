import strokes from 'reducers/strokes'
import undoable from 'reducers/undoable';
import * as actionTypes from 'constants/actionTypes';
import { last } from 'lodash';

let defaultScene = () => {
	return {
		strokes: []
	}
}

const scenes = (state = [], action) => {
	switch(action.type) {
		case actionTypes.APPEND_POINT:
		case actionTypes.CREATE_STROKE:
		case actionTypes.FINISH_STROKE:
			return [{
				strokes: strokes((last(state) || defaultScene()).strokes, action)
			}];
		default:
			return state;
	}
}

const undoableScenes = undoable(scenes, {})

export default undoableScenes;