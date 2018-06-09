// @flow
import type { Stroke, TextCandidate, ShapeCandidate } from './typeDefinitions';
import { APPEND_POINT, APPEND_STROKE } from './constants/actionTypes';

export type APPEND_POINT_ACTION = {
	type: typeof APPEND_POINT;
	x: number;
	y: number;
	timeStamp: number;
	sceneIndex: number;
}

export type APPEND_STROKE_ACTION = {
	type: typeof APPEND_STROKE;
	x: number;
	y: number;
	timeStamp: number;
	sceneIndex: number;
}

export type FINISH_STROKE_ACTION = {
	type: 'FINISH_STROKE';
	x: number;
	y: number;
	timeStamp: number;
	sceneIndex: number;
}

export type TOGGLE_PLOMA_ACTION = {
	type: 'TOGGLE_PLOMA';
	boolean: boolean;
}

export type JUMP_TO_ACTION = {
	type: 'JUMP_TO';
	pointInTime: number;
	sceneIndex: number;
}

export type UPDATE_THRESHOLD_ACTION = {
	type: 'UPDATE_THRESHOLD';
	number: number;
}

export type UPDATE_POSITION_ACTION = {
	type: 'UPDATE_POSITION',
	strokes: Stroke[],
	origin: {
		x: number;
		y: number;
	},
	target: {
		x: number;
		y: number;
	},
	sceneIndex: number
}

export type ENHANCED_UPDATE_POSITION_ACTION = UPDATE_POSITION_ACTION & {
	sceneIndex: number;
}

export type ROTATE_BY_ACTION = {
	type: 'ROTATE_BY',
	strokes: Stroke[],
	centerX: number,
	centerY: number,
	degrees: number,
	sceneIndex: number,
}

export type HIDE_ACTION = {
	type: 'HIDE';
	strokes: Array<Stroke>;
	sceneIndex: number;
}

export type SELECT_ACTION = {
	type: 'SELECT';
	strokes: Array<Stroke>;
	sceneIndex: number;
}

export type TOGGLE_HANDWRITING_RECOGNITION_ACTION = {
	type: 'TOGGLE_HANDWRITING_RECOGNITION';
	boolean: boolean;
}

export type TOGGLE_DRAWING_ACTION = {
	type: 'TOGGLE_DRAWING';
	boolean: boolean;
}

export type OBSERVE_MUTATIONS_ACTION = {
	type: 'OBSERVE_MUTATIONS';
	boolean: boolean;
}

export type TOGGLE_INTERPRETER_ACTION = {
	type: 'TOGGLE_INTERPRETER';
	boolean: boolean;
}

export type SET_SCENE_INDEX_ACTION = {
	type: 'SET_SCENE_INDEX';
	max: number;
	number: number;
}

export type ADD_SCENE_ACTION = {
	type: 'ADD_SCENE';
	sceneIndex: number;
}

export type ADD_SCENE_AT_ACTION = {
	type: 'ADD_SCENE_AT';
	number: number;
	sceneIndex: number;
}

export type NEXT_SCENE_ACTION = {
	type: 'NEXT_SCENE';
}

export type PREVIOUS_SCENE_ACTION = {
	type: 'PREVIOUS_SCENE';
}

export type SELECT_INSIDE_ACTION = {
	type: 'SELECT_INSIDE';
	strokes: Array<Stroke>;
	sceneIndex: number;
}

export type REQUEST_SHAPE_CANDIDATES_ACTION = {
	type: 'REQUEST_SHAPE_CANDIDATES';
	strokes: Array<Stroke>;
}

export type RECEIVE_SHAPE_CANDIDATES_ACTION = {
	type: 'RECEIVE_SHAPE_CANDIDATES';
	candidates: Array<ShapeCandidate>;
}

export type REQUEST_TEXT_CANDIDATES_ACTION = {
	type: 'REQUEST_TEXT_CANDIDATES',
	strokes: Array<Stroke>;
}

export type RECEIVE_TEXT_CANDIDATES_ACTION = {
	type: 'RECEIVE_TEXT_CANDIDATES';
	candidates: Array<TextCandidate>
}

export type APPEND_SPECIFC_ACTION_ACTION = {
	type: 'APPEND_SPECIFC_ACTION',
	actionName: string,
	actionNames: Array<string>,
}
