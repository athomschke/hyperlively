// @flow
import { takeLatest, call, put } from 'redux-saga/effects';

import { requestTextCandidates, requestShapeCandidates } from 'src/client/app/helpers/handwritingRecognizer';
import { receiveTextCandidates, receiveShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import { TEXT_CANDIDATES_FETCH_REQUESTED, SHAPE_CANDIDATES_FETCH_REQUESTED } from 'src/client/app/constants/actionTypes';
import type { REQUEST_TEXT_CANDIDATES_ACTION, REQUEST_SHAPE_CANDIDATES_ACTION,
RECEIVE_TEXT_CANDIDATES_ACTION, RECEIVE_SHAPE_CANDIDATES_ACTION } from 'src/client/app/actionTypeDefinitions';

export function* fetchTextCandidates(action: REQUEST_TEXT_CANDIDATES_ACTION):
RECEIVE_TEXT_CANDIDATES_ACTION {
	try {
		const textCandidates = yield call(requestTextCandidates, action.strokes);
		yield put(receiveTextCandidates(textCandidates));
	} catch (e) {
		yield put(receiveTextCandidates([]));
	}
}

export function* fetchShapeCandidates(action: REQUEST_SHAPE_CANDIDATES_ACTION):
RECEIVE_SHAPE_CANDIDATES_ACTION {
	try {
		const shapeCandidates = yield call(requestShapeCandidates, action.strokes);
		yield put(receiveShapeCandidates(shapeCandidates));
	} catch (e) {
		yield put(receiveShapeCandidates([]));
	}
}

export function* myScriptJs() {
	yield takeLatest(TEXT_CANDIDATES_FETCH_REQUESTED, fetchTextCandidates);
	yield takeLatest(SHAPE_CANDIDATES_FETCH_REQUESTED, fetchShapeCandidates);
}
