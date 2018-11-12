// @flow
import * as ActionTypes from 'src/constants/actionTypes';
import type {
	TextCandidate, ShapeCandidate, Stroke, Functions, Parameters,
} from 'src/types';

export function appendSpecificAction(actionName: string, ...actionNames: Array<string>) {
	return { type: ActionTypes.APPEND_SPECIFC_ACTION, actionName, actionNames };
}

export function togglePloma(boolean: boolean) {
	return { type: ActionTypes.TOGGLE_PLOMA, boolean };
}

export function updateThreshold(number: number) {
	return { type: ActionTypes.UPDATE_THRESHOLD, number };
}

export function toggleHandwritingRecognition(boolean: boolean) {
	return { type: ActionTypes.TOGGLE_HANDWRITING_RECOGNITION, boolean };
}

export function setObserveMutations(boolean: boolean) {
	return { type: ActionTypes.OBSERVE_MUTATIONS, boolean };
}

export function setSceneIndex(number: number) {
	return { type: ActionTypes.SET_SCENE_INDEX, number, max: NaN };
}

export function jumpTo(pointInTime: number, sceneIndex: number) {
	return { type: ActionTypes.JUMP_TO, pointInTime, sceneIndex };
}

export function toggleInterpreter(boolean: boolean) {
	return { type: ActionTypes.TOGGLE_INTERPRETER, boolean };
}

export function appendPoint(x: number, y: number, timeStamp: number) {
	return {
		type: ActionTypes.APPEND_POINT, x, y, timeStamp, sceneIndex: NaN,
	};
}

export function createStroke(x: number, y: number, timeStamp: number) {
	return {
		type: ActionTypes.APPEND_STROKE,
		id: Math.ceil(Math.random() * 1000000),
		x,
		y,
		timeStamp,
		sceneIndex: NaN,
	};
}

export function finishStroke(x: number, y: number, timeStamp: number) {
	return {
		type: ActionTypes.FINISH_STROKE, x, y, timeStamp, sceneIndex: NaN,
	};
}

export function toggleDrawing(boolean: boolean) {
	return { type: ActionTypes.TOGGLE_DRAWING, boolean };
}

export function addSceneAt(number: number) {
	return { type: ActionTypes.ADD_SCENE_AT, number, sceneIndex: NaN };
}

export const addScene = () => ({
	type: ActionTypes.ADD_SCENE,
	sceneIndex: NaN,
});

export function nextScene() {
	return { type: ActionTypes.NEXT_SCENE };
}

export function previousScene() {
	return { type: ActionTypes.PREVIOUS_SCENE };
}

export function receiveTextCandidates(candidates: Array<TextCandidate>, strokeIds: number[]) {
	return { type: ActionTypes.RECEIVE_TEXT_CANDIDATES, candidates, strokeIds };
}

export function receiveShapeCandidates(candidates: Array<ShapeCandidate>, strokeIds: number[]) {
	return { type: ActionTypes.RECEIVE_SHAPE_CANDIDATES, candidates, strokeIds };
}

export function requestTextCandidates(strokes: Array<Stroke>) {
	return { type: ActionTypes.REQUEST_TEXT_CANDIDATES, strokes };
}

export function requestShapeCandidates(strokes: Array<Stroke>) {
	return { type: ActionTypes.REQUEST_SHAPE_CANDIDATES, strokes };
}

export function clearRecognitionResults() {
	return { type: ActionTypes.CLEAR_RECOGNITION_RESULTS };
}

export const updatePosition = (
	strokes: Stroke[],
	originX: number,
	originY: number,
	targetX: number,
	targetY: number,
) => ({
	type: ActionTypes.UPDATE_POSITION,
	strokes,
	origin: {
		x: originX,
		y: originY,
	},
	target: {
		x: targetX,
		y: targetY,
	},
	sceneIndex: NaN,
});

export const rotateBy = (
	strokes: Stroke[],
	centerX: number,
	centerY: number,
	degrees: number,
) => ({
	type: ActionTypes.ROTATE_BY,
	strokes,
	centerX: parseInt(centerX, 10),
	centerY: parseInt(centerY, 10),
	degrees: parseInt(degrees, 10),
	sceneIndex: NaN,
});

export const hide = (strokes: Array<Stroke>) => ({
	type: ActionTypes.HIDE,
	strokes,
	sceneIndex: NaN,
});

export const select = (strokes: Array<Stroke>) => ({
	type: ActionTypes.SELECT,
	strokes,
	sceneIndex: NaN,
});

export const selectInside = (strokes: Array<Stroke>) => ({
	type: ActionTypes.SELECT_INSIDE,
	strokes,
	sceneIndex: NaN,
});

export const selectAt = (x: number, y: number) => ({
	type: ActionTypes.SELECT_AT,
	x,
	y,
	sceneIndex: NaN,
});

export const checkActionsPath = (path: Array<string>) => ({
	type: ActionTypes.CHECK_ACTIONS_PATH,
	path,
});

export const collapseActionsPath = (path: Array<string>) => ({
	type: ActionTypes.EXPAND_ACTIONS_PATH,
	path,
});

export const checkParametersPath = (path: Array<string>) => ({
	type: ActionTypes.CHECK_PARAMETERS_PATH,
	path,
});

export const collapseParametersPath = (path: Array<string>) => ({
	type: ActionTypes.EXPAND_PARAMETERS_PATH,
	path,
});

export const chooseFunctions = (functions: Functions) => ({
	type: ActionTypes.CHOOSE_FUNCTIONS,
	functions,
});

export const chooseParameters = (parameters: Parameters) => ({
	type: ActionTypes.CHOOSE_PARAMETERS,
	parameters,
});

export const storeInterpretation = (label: string, actions: string[], parameters: Parameters) => ({
	type: ActionTypes.STORE_INTERPRETATION,
	label,
	actions,
	parameters,
});
