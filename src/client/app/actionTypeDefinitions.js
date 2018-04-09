import type { Stroke, TextCandidate, ShapeCandidate } from './typeDefinitions';

export type APPEND_POINT_ACTION = {
	type: 'APPEND_POINT';
	x: number;
	y: number;
	timeStamp: number
}

export type APPEND_STROKE_ACTION = {
	type: 'APPEND_STROKE';
	x: number;
	y: number;
	timeStamp: number
}

export type FINISH_STROKE_ACTION = {
	type: 'FINISH_STROKE';
	x: number;
	y: number;
	timeStamp: number
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
	type: 'UPDATE_POSITION';
	strokes: Stroke[];
	originX: number;
	originY: number;
	targetX: number;
	targetY: number;
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
}

export type HIDE_ACTION = {
	type: 'HIDE';
	strokes: Array<Stroke>;
}

export type SELECT_ACTION = {
	type: 'SELECT';
	strokes: Array<Stroke>;
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
	number: number;
}

export type ENHANCED_SET_SCENE_INDEX_ACTION = SET_SCENE_INDEX_ACTION & {
	max: number;
}

export type ADD_SCENE_ACTION = {
	type: 'ADD_SCENE';
}

export type ADD_SCENE_AT_ACTION = {
	type: 'ADD_SCENE_AT';
	number: number;
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
}

export type REQUEST_SHAPE_CANDIDATES_ACTION = {
	type: 'REQUEST_SHAPE_CANDIDATES_ACTION';
}

export type RECEIVE_SHAPE_CANDIDATES_ACTION = {
	type: 'RECEIVE_SHAPE_CANDIDATES_ACTION';
	candidates: Array<ShapeCandidate>
}

export type REQUEST_TEXT_CANDIDATES_ACTION = {
	type: 'REQUEST_TEXT_CANDIDATES_ACTION';
}

export type RECEIVE_TEXT_CANDIDATES_ACTION = {
	type: 'RECEIVE_TEXT_CANDIDATES_ACTION';
	candidates: Array<TextCandidate>
}
