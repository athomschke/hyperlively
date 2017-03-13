// @flow
import { APPEND_POINT, APPEND_STROKE, FINISH_STROKE, UPDATE_POSITION, HIDE, ADD_SCENE, ADD_SCENE_AT, SELECT, SELECT_INSIDE } from 'constants/actionTypes';
import { strokes } from './strokes';
import { type Scene } from '../typeDefinitions';
import {
	type APPEND_POINT_ACTION, type APPEND_STROKE_ACTION, type FINISH_STROKE_ACTION,
	type HIDE_ACTION, type SELECT_ACTION, type SELECT_INSIDE_ACTION, type UPDATE_POSITION_ACTION,
	type ADD_SCENE_ACTION,
	type ADD_SCENE_AT_ACTION,
} from '../actionTypeDefinitions';

const defaultScene = () => ({
	strokes: [],
});

function scenes(state: Array<Scene> = [defaultScene()], action:
		APPEND_POINT_ACTION | APPEND_STROKE_ACTION | FINISH_STROKE_ACTION |
		HIDE_ACTION | SELECT_ACTION | SELECT_INSIDE_ACTION | UPDATE_POSITION_ACTION |
		ADD_SCENE_ACTION |
		ADD_SCENE_AT_ACTION) {
	switch (action.type) {
	case APPEND_POINT:
	case APPEND_STROKE:
	case FINISH_STROKE: {
		if (state.length > 0) {
			const newScene = Object.assign({}, state[action.sceneIndex], {
				strokes: strokes(state[action.sceneIndex].strokes, action),
			});
			const newState = [].concat(
				state.slice(action.sceneIndex - 1, action.sceneIndex),
				[newScene],
				state.slice(action.sceneIndex + 1),
			);
			return newState;
		}
		const newState = [defaultScene()];
		newState[0].strokes = strokes(newState[0].strokes, action);
		return newState;
	}
	case HIDE:
	case SELECT:
	case SELECT_INSIDE:
	case UPDATE_POSITION: {
		const newScene = Object.assign({}, state[action.sceneIndex], {
			strokes: strokes(state[action.sceneIndex].strokes, action),
		});
		const newState = [].concat(
			state.slice(action.sceneIndex - 1, action.sceneIndex),
			[newScene],
			state.slice(action.sceneIndex + 1),
		);
		return newState;
	}
	case ADD_SCENE:
		return state.concat([defaultScene()]);
	case ADD_SCENE_AT:
		return state
			.slice(0, action.number)
			.concat([defaultScene()], state.slice(action.number, state.length));
	default:
		return state;
	}
}

export { scenes };
