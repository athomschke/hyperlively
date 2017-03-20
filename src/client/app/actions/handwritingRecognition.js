// @flow
import { requestTextRecognitionForStrokesThenDo, requestShapeRecognitionForStrokesThenDo } from 'helpers/handwritingRecognizer';
import { REQUEST_SHAPE_CANDIDATES, REQUEST_TEXT_CANDIDATES, RECEIVE_SHAPE_CANDIDATES, RECEIVE_TEXT_CANDIDATES } from 'constants/actionTypes';
import { type Stroke, type TextCandidate, type ShapeCandidate } from '../typeDefinitions';
import { type REQUEST_SHAPE_CANDIDATES_ACTION, type RECEIVE_SHAPE_CANDIDATES_ACTION, type REQUEST_TEXT_CANDIDATES_ACTION, type RECEIVE_TEXT_CANDIDATES_ACTION } from '../actionTypeDefinitions';

export function requestTextCandidates() {
	return { type: REQUEST_TEXT_CANDIDATES };
}

export function requestShapeCandidates() {
	return { type: REQUEST_SHAPE_CANDIDATES };
}

export function receiveTextCandidates(candidates: Array<TextCandidate>) {
	return { type: RECEIVE_TEXT_CANDIDATES, candidates };
}

export function receiveShapeCandidates(candidates: Array<ShapeCandidate>) {
	return { type: RECEIVE_SHAPE_CANDIDATES, candidates };
}

export function fetchShapeCandidates(strokes: Array<Stroke>) {
	return (
			dispatch: (action: REQUEST_SHAPE_CANDIDATES_ACTION | RECEIVE_SHAPE_CANDIDATES_ACTION) => void,
		) => {
		dispatch(requestShapeCandidates(strokes));
		return new Promise((resolve) => {
			requestShapeRecognitionForStrokesThenDo(strokes, resolve);
		})
		.then(candidates => dispatch(receiveShapeCandidates(candidates)));
	};
}

export function fetchTextCandidates(strokes: Array<Stroke>) {
	return (
			dispatch: (action: REQUEST_TEXT_CANDIDATES_ACTION | RECEIVE_TEXT_CANDIDATES_ACTION) => void,
		) => {
		dispatch(requestTextCandidates());
		return new Promise((resolve) => {
			requestTextRecognitionForStrokesThenDo(strokes, resolve);
		}).then(candidates => {
			dispatch(receiveTextCandidates(candidates));
		});
	};
}
