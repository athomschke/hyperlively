// @flow
import { HmacSHA512, enc } from 'crypto-js';
import { flatten, map } from 'lodash';
import { APPLICATION_KEY, HMAC_KEY, TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL } from 'constants/handwriting';
import { strokesToComponents, getStringInput } from 'helpers/handwritingRecognizer';
import { REQUEST_SHAPE_CANDIDATES, REQUEST_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES, RECEIVE_TEXT_CANDIDATES, RECOGNIZE_HANDWRITING, TOGGLE_PLOMA, UPDATE_THRESHOLD, TOGGLE_HANDWRITING_RECOGNITION, OBSERVE_MUTATIONS, SET_SCENE_INDEX, JUMP_TO, TOGGLE_INTERPRETER } from 'constants/actionTypes';
import { type Stroke, type RecognizerShapeResult, type RecognizerTextResult } from '../typeDefinitions';

export function togglePloma(boolean: boolean) {
	return { type: TOGGLE_PLOMA, boolean };
}

export function updateThreshold(number: number) {
	return { type: UPDATE_THRESHOLD, number };
}

export function toggleHandwritingRecognition(boolean: boolean) {
	return { type: TOGGLE_HANDWRITING_RECOGNITION, boolean };
}

export function setObserveMutations(boolean: boolean) {
	return { type: OBSERVE_MUTATIONS, boolean };
}

export function setSceneIndex(number: number) {
	return { type: SET_SCENE_INDEX, number };
}

export function jumpTo(pointInTime: number, sceneIndex: number) {
	return { type: JUMP_TO, pointInTime, sceneIndex };
}

export function toggleInterpreter(boolean: boolean) {
	return { type: TOGGLE_INTERPRETER, boolean };
}

export function recognizeHandwriting(strokes: Array<Stroke>) {
	return { type: RECOGNIZE_HANDWRITING, strokes };
}

function requestTextCandidates(components: Array<Stroke>) {
	return { type: REQUEST_TEXT_CANDIDATES, components };
}

function requestShapeCandidates(components: Array<Stroke>) {
	return { type: REQUEST_SHAPE_CANDIDATES, components };
}

function receiveTextCandidates(candidates: Array<RecognizerTextResult>) {
	return { type: RECEIVE_TEXT_CANDIDATES, candidates };
}

function receiveShapeCandidates(candidates: Array<RecognizerShapeResult>) {
	return { type: RECEIVE_SHAPE_CANDIDATES, candidates };
}

function fetch(url: string, data: string) {
	return new Promise((resolve) => {
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		xmlhttp.withCredentials = true;
		xmlhttp.setRequestHeader('Accept', 'application/json');
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				resolve(xmlhttp.responseText);
			}
		};
		xmlhttp.send(data);
	});
}

const hmacData = stringInput =>
	encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY)
		.toString(enc.Hex));

const applicationKeyData = () => encodeURIComponent(APPLICATION_KEY);

const encodedInputData = input => encodeURIComponent(input);

function getTextRecognitionData(strokes: Array<Stroke>) {
	const components = strokesToComponents(strokes);
	const stringInput = getStringInput(components);
	return `applicationKey=${applicationKeyData()}&textInput=${encodedInputData(stringInput)}&hmac=${hmacData(stringInput)}`;
}

const getShapeInput = strokes => JSON.stringify({
	components: strokes,
	doBeautification: true,
});

function getShapeRecognitionData(strokes: Array<Stroke>) {
	const components = strokesToComponents(strokes);
	const shapeInput = getShapeInput(components);
	return `applicationKey=${applicationKeyData()}&shapeInput=${encodedInputData(shapeInput)}&hmac=${hmacData(shapeInput)}`;
}

const parseResult = (result: RecognizerShapeResult | RecognizerTextResult) => {
	if (result.textSegmentResult) {
		const candidates = result.textSegmentResult.candidates;
		if (candidates.length > 0) {
			return candidates;
		}
	} else if (result.segments && result.segments.length > 0) {
		return flatten(map(result.segments, 'candidates'));
	}
	return [];
};

const parseResponse = (responseText: string) => {
	const answer = JSON.parse(responseText);
	if (answer && answer.result) {
		return parseResult(answer.result);
	}
	return [];
};

export function fetchShapeCandidates(strokes: Array<Stroke>) {
	return (dispatch) => {
		dispatch(requestShapeCandidates(strokes));
		const data: string = getShapeRecognitionData(strokes);
		return fetch(SHAPE_RECOGNITION_URL, data)
			.then(responseText => parseResponse(responseText))
			.then(candidates => dispatch(receiveShapeCandidates(candidates)));
	};
}

export function fetchTextCandidates(strokes: Array<Stroke>) {
	return (dispatch) => {
		dispatch(requestTextCandidates(strokes));
		const data: string = getTextRecognitionData(strokes);
		return fetch(TEXT_RECOGNITION_URL, data)
			.then(responseText => parseResponse(responseText))
			.then(candidates => dispatch(receiveTextCandidates(candidates)));
	};
}
