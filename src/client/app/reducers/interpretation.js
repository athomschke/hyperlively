// @flow
import { TOGGLE_INTERPRETER, RECOGNIZE_HANDWRITING } from 'constants/actionTypes';
import { map, flatten } from 'lodash';
import { HmacSHA512, enc } from 'crypto-js';
import { APPLICATION_KEY, HMAC_KEY, TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL } from 'constants/handwriting';
import { strokesToComponents, getStringInput } from 'helpers/handwritingRecognizer';
import { type TOGGLE_INTERPRETER_ACTION, RECOGNIZE_HANDWRITING_ACTION } from '../actionTypeDefinitions';
import { type InterpretationState, type RecognizerShapeResult, type RecognizerTextResult, type RecognizerComponent } from '../typeDefinitions';

const hmacData = stringInput =>
	encodeURIComponent(HmacSHA512(stringInput, APPLICATION_KEY + HMAC_KEY)
		.toString(enc.Hex));

const getShapeInput = strokes => JSON.stringify({
	components: strokes,
	doBeautification: true,
});

const applicationKeyData = () => encodeURIComponent(APPLICATION_KEY);

const encodedInputData = input => encodeURIComponent(input);

const xmlHttpRequest = (url: string) => {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', url, false);
	xmlhttp.withCredentials = true;
	xmlhttp.setRequestHeader('Accept', 'application/json');
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
	return xmlhttp;
};

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

const parseResponse = (request: XMLHttpRequest) => {
	if (request.readyState === 4 && request.status === 200) {
		const answer = JSON.parse(request.responseText);
		if (answer && answer.result) {
			return parseResult(answer.result);
		}
	}
	return [];
};

const recognizeText = (components: Array<RecognizerComponent>) => {
	const stringInput = getStringInput(components);
	const data = `applicationKey=${applicationKeyData()}&textInput=${encodedInputData(stringInput)}&hmac=${hmacData(stringInput)}`;
	const request = xmlHttpRequest(TEXT_RECOGNITION_URL);
	request.send(data);
	return parseResponse(request);
};

const recognizeShape = (components: Array<RecognizerComponent>) => {
	const shapeInput = getShapeInput(components);
	const data = `applicationKey=${applicationKeyData()}&shapeInput=${encodedInputData(shapeInput)}&hmac=${hmacData(shapeInput)}`;
	const request = xmlHttpRequest(SHAPE_RECOGNITION_URL);
	request.send(data);
	return parseResponse(request);
};

const getInterpretations = (strokes = []) => {
	const components = strokesToComponents(strokes);
	return {
		candidate: {
			text: recognizeText(components),
			shape: recognizeShape(components),
		},
	};
};

const initialState = () => ({
	showInterpreter: false,
	interpretations: {
		candidate: {
			shape: null,
			text: null,
		},
	},
});

function interpretation(
		state: InterpretationState = initialState(),
		action: TOGGLE_INTERPRETER_ACTION | RECOGNIZE_HANDWRITING_ACTION) {
	switch (action.type) {
	case TOGGLE_INTERPRETER: {
		return Object.assign({}, state, {
			showInterpreter: action.boolean,
		});
	}
	case RECOGNIZE_HANDWRITING: {
		return Object.assign({}, state, {
			interpretations: getInterpretations(action.strokes),
		});
	}
	default: {
		return state;
	}
	}
}

export { interpretation };
