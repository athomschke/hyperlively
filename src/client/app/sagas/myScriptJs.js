// @flow
import { takeEvery, call, put, type TakeHelper, type PutEffect } from 'redux-saga/effects';

import { REQUEST_TEXT_CANDIDATES, REQUEST_SHAPE_CANDIDATES } from 'src/client/app/constants/actionTypes';
import { receiveTextCandidates, receiveShapeCandidates } from 'src/client/app/actionCreators';
import type {
	REQUEST_TEXT_CANDIDATES_ACTION, REQUEST_SHAPE_CANDIDATES_ACTION,
	RECEIVE_TEXT_CANDIDATES_ACTION, RECEIVE_SHAPE_CANDIDATES_ACTION,
} from 'src/client/app/actionTypeDefinitions';

import { requestTextCandidates, requestShapeCandidates } from './handwritingRecognizer';

export function* fetchTextCandidates(action: REQUEST_TEXT_CANDIDATES_ACTION):
Generator<PutEffect<RECEIVE_TEXT_CANDIDATES_ACTION>, void, void> {
	try {
		const response = yield call(requestTextCandidates, action.strokes);
		if (typeof response === 'undefined') {
			throw new Error('requesting text candidates did not respond');
		} else {
			yield put(receiveTextCandidates(response));
		}
	} catch (e) {
		yield put(receiveTextCandidates([]));
	}
}

export function* fetchShapeCandidates(action: REQUEST_SHAPE_CANDIDATES_ACTION):
Generator<PutEffect<RECEIVE_SHAPE_CANDIDATES_ACTION>, void, void> {
	try {
		const response = yield call(requestShapeCandidates, action.strokes);
		if (typeof response === 'undefined') {
			throw new Error('requesting text candidates did not respond');
		} else {
			yield put(receiveShapeCandidates(response));
		}
	} catch (e) {
		yield put(receiveShapeCandidates([]));
	}
}

export function* myScriptJs():
Generator<TakeHelper<RECEIVE_SHAPE_CANDIDATES_ACTION|RECEIVE_TEXT_CANDIDATES_ACTION>, void, void> {
	yield takeEvery(REQUEST_TEXT_CANDIDATES, fetchTextCandidates);
	yield takeEvery(REQUEST_SHAPE_CANDIDATES, fetchShapeCandidates);
}
