// @flow
import { RECEIVE_SHAPE_CANDIDATES, RECEIVE_TEXT_CANDIDATES, REQUEST_TEXT_CANDIDATES, REQUEST_SHAPE_CANDIDATES, TEXT_CANDIDATES_FETCH_REQUESTED, SHAPE_CANDIDATES_FETCH_REQUESTED } from 'src/client/app/constants/actionTypes';
import { type Stroke, type TextCandidate, type ShapeCandidate } from 'src/client/app/typeDefinitions';

export function receiveTextCandidates(candidates: Array<TextCandidate>) {
	return { type: RECEIVE_TEXT_CANDIDATES, candidates };
}

export function receiveShapeCandidates(candidates: Array<ShapeCandidate>) {
	return { type: RECEIVE_SHAPE_CANDIDATES, candidates };
}

export function requestTextCandidates(strokes: Array<Stroke>) {
	return { type: REQUEST_TEXT_CANDIDATES, strokes };
}

export function requestShapeCandidates(strokes: Array<Stroke>) {
	return { type: REQUEST_SHAPE_CANDIDATES, strokes };
}

export function fetchTextCandidates(strokes: Array<Stroke>) {
	return { type: TEXT_CANDIDATES_FETCH_REQUESTED, strokes };
}

export function fetchShapeCandidates(strokes: Array<Stroke>) {
	return { type: SHAPE_CANDIDATES_FETCH_REQUESTED, strokes };
}
