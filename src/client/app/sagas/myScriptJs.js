import { takeEvery, call, put } from 'redux-saga/effects';
import { requestTextCandidates, requestShapeCandidates } from 'helpers/handwritingRecognizer';
import { receiveTextCandidates, receiveShapeCandidates } from 'actions/handwritingRecognition';
import { TEXT_CANDIDATES_FETCH_REQUESTED, SHAPE_CANDIDATES_FETCH_REQUESTED } from 'constants/actionTypes';

function* fetchTextCandidates(action) {
	try {
		const textCandidates = yield call(requestTextCandidates, action.strokes);
		yield put(receiveTextCandidates(textCandidates));
	} catch (e) {
		yield put(receiveTextCandidates([]));
	}
}

function* fetchShapeCandidates(action) {
	try {
		const shapeCandidates = yield call(requestShapeCandidates, action.strokes);
		yield put(receiveShapeCandidates(shapeCandidates));
	} catch (e) {
		yield put(receiveShapeCandidates([]));
	}
}

function* myScriptJs() {
	yield takeEvery(TEXT_CANDIDATES_FETCH_REQUESTED, fetchTextCandidates);
	yield takeEvery(SHAPE_CANDIDATES_FETCH_REQUESTED, fetchShapeCandidates);
}

export default myScriptJs;
