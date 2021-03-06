// @flow
import 'babel-polyfill';
import {
	takeEvery, call, put, type TakeHelper, type PutEffect,
} from 'redux-saga/effects';

import { REQUEST_TEXT_CANDIDATES, REQUEST_SHAPE_CANDIDATES } from 'src/constants/actionTypes';
import { MOCKED_RESPONSES } from 'src/constants/configuration';
import { lineShapeResponse, ellipsisShapeResponse, textResponse } from 'src/constants/mocks';
import { receiveTextCandidates, receiveShapeCandidates } from 'src/actionCreators';
import type {
	REQUEST_TEXT_CANDIDATES_ACTION, REQUEST_SHAPE_CANDIDATES_ACTION,
	RECEIVE_TEXT_CANDIDATES_ACTION, RECEIVE_SHAPE_CANDIDATES_ACTION,
} from 'src/actionTypeDefinitions';

import { requestTextCandidates, requestShapeCandidates } from './handwritingRecognizer';

export function* fetchTextCandidates(action: REQUEST_TEXT_CANDIDATES_ACTION):
Generator<PutEffect<RECEIVE_TEXT_CANDIDATES_ACTION>, void, void> {
	try {
		if (MOCKED_RESPONSES) {
			yield put(receiveTextCandidates([JSON.parse(textResponse())], action.strokes.map(stroke => stroke.id)));
		} else {
			const response = yield call(requestTextCandidates, action.strokes);
			if (typeof response === 'undefined') {
				throw new Error('requesting text candidates did not respond');
			} else {
				yield put(receiveTextCandidates(response, action.strokes.map(stroke => stroke.id)));
			}
		}
	} catch (e) {
		yield put(receiveTextCandidates([], action.strokes.map(stroke => stroke.id)));
	}
}

export function* fetchShapeCandidates(action: REQUEST_SHAPE_CANDIDATES_ACTION):
Generator<PutEffect<RECEIVE_SHAPE_CANDIDATES_ACTION>, void, void> {
	try {
		if (MOCKED_RESPONSES) {
			yield put(receiveShapeCandidates([
				JSON.parse(lineShapeResponse()),
				JSON.parse(ellipsisShapeResponse()),
			], action.strokes.map(stroke => stroke.id)));
		} else {
			const response = yield call(requestShapeCandidates, action.strokes);
			if (typeof response === 'undefined') {
				throw new Error('requesting text candidates did not respond');
			} else {
				yield put(receiveShapeCandidates(response, action.strokes.map(stroke => stroke.id)));
			}
		}
	} catch (e) {
		yield put(receiveShapeCandidates([], action.strokes.map(stroke => stroke.id)));
	}
}

export function* myScriptJs():
Generator<TakeHelper<RECEIVE_SHAPE_CANDIDATES_ACTION|RECEIVE_TEXT_CANDIDATES_ACTION>, void, void> {
	yield takeEvery(REQUEST_TEXT_CANDIDATES, fetchTextCandidates);
	yield takeEvery(REQUEST_SHAPE_CANDIDATES, fetchShapeCandidates);
}
