// @flow
import { HmacSHA512, enc } from 'crypto-js';
import { map, flatten } from 'lodash';

import { APPLICATION_KEY, HMAC_KEY, TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE, TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL } from 'src/client/app/constants/handwriting';
import type { Stroke, RecognizerComponent, TextCandidates } from 'src/client/app/typeDefinitions';

const hmacData = stringInput =>
	encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY)
		.toString(enc.Hex));

const applicationKeyData = () => encodeURIComponent(APPLICATION_KEY);

const encodedInputData = input => encodeURIComponent(input);

const getShapeInput = strokes => JSON.stringify({
	components: strokes,
	doBeautification: true,
});

function strokesToComponents(strokes: Array<Stroke>) {
	return map(strokes, stroke => ({
		type: 'stroke',
		x: map(stroke.points, 'x'),
		y: map(stroke.points, 'y'),
		t: map(stroke.points, 'timeStamp'),
	}));
}

function getStringInput(components: Array<RecognizerComponent>) {
	return JSON.stringify({
		textParameter: {
			textProperties: {},
			language: LANGUAGE,
			textInputMode: TEXT_INPUT_MODE,
		},
		inputUnits: [{
			textInputType: TEXT_INPUT_TYPE,
			components,
		}],
	});
}

function getShapeRecognitionData(strokes: Array<Stroke>) {
	const components = strokesToComponents(strokes);
	const shapeInput = getShapeInput(components);
	return `applicationKey=${applicationKeyData()}&shapeInput=${encodedInputData(shapeInput)}&hmac=${hmacData(shapeInput)}`;
}

function getTextRecognitionData(strokes: Array<Stroke>) {
	const components = strokesToComponents(strokes);
	const stringInput = getStringInput(components);
	return `applicationKey=${applicationKeyData()}&textInput=${encodedInputData(stringInput)}&hmac=${hmacData(stringInput)}`;
}

function parseShapeResponse(responseText: string) {
	const answer = JSON.parse(responseText);
	if (answer && answer.result) {
		return flatten(map(answer.result.segments, 'candidates'));
	}
	return [];
}

function parseTextResponse(responseText: string): TextCandidates {
	const answer = JSON.parse(responseText);
	if (answer && answer.result) {
		const candidates = answer.result.textSegmentResult.candidates;
		if (candidates.length > 0) {
			return candidates;
		}
		return [];
	}
	return [];
}

function sendRequestThenDo(url: string, data: string, parseCallback) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', url, true);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader('Accept', 'application/json');
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			parseCallback(xmlhttp.responseText);
		}
	};
	xmlhttp.send(data);
}

export function requestTextCandidates(strokes: Array<Stroke>) {
	const textPromise: Promise<TextCandidates> = new Promise((resolve) => {
		sendRequestThenDo(
			TEXT_RECOGNITION_URL,
			getTextRecognitionData(strokes),
			(responseText: string) => resolve(parseTextResponse(responseText)),
		);
	});
	return textPromise;
}

export function requestShapeCandidates(strokes: Array<Stroke>) {
	return new Promise((resolve) => {
		sendRequestThenDo(
			SHAPE_RECOGNITION_URL,
			getShapeRecognitionData(strokes),
			(responseText: string) => resolve(parseShapeResponse(responseText)),
		);
	});
}
