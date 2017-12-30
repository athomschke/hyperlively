import { filter } from 'lodash';
import { call } from 'redux-saga/effects';

import { myScriptJs, fetchTextCandidates, fetchShapeCandidates } from 'sagas/myScriptJs';
import * as actions from 'actions/handwritingRecognition';
import { TEXT_CANDIDATES_FETCH_REQUESTED, SHAPE_CANDIDATES_FETCH_REQUESTED } from 'constants/actionTypes';
import initialState from 'test/integration/data/canvasWithIrregularStrokesWithPloma.json';

const getInitialState = () => initialState.json;

describe('MyScriptJS Sagas', () => {
	let xhr;
	let requests = [];

	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		xhr.onCreate = (req) => {
			requests.push(req);
		};
	});

	afterEach(() => {
		xhr.restore();
		requests = [];
	});

	describe('Main saga', () => {
		it('forks sagas to fetch shape and text recognition', () => {
			const generator = myScriptJs(getInitialState);
			const items = [];
			let next = generator.next();
			while (next.value) {
				items.push(next);
				next = generator.next();
			}
			const text = filter(items,
				item => item.value.FORK.args[0] === TEXT_CANDIDATES_FETCH_REQUESTED);
			const shape = filter(items,
				item => item.value.FORK.args[0] === SHAPE_CANDIDATES_FETCH_REQUESTED);
			expect(text).to.exist();
			expect(shape).to.exist();
		});
	});

	describe('Text recognition saga', () => {
		it('yields a requestTextCandidates action', () => {
			const strokes = initialState.json.content.undoableScenes.present[0].strokes;
			const fetchAction = actions.fetchTextCandidates(strokes);
			const generator = fetchTextCandidates(fetchAction);
			const next = generator.next();
			const desiredCall = call(actions.requestTextCandidates, strokes);
			expect(next.value.CALL.fn.name).to.deep.equal(desiredCall.CALL.fn.name);
		});
	});

	describe('Shape recognition saga', () => {
		it('yields a requestShapeCandidates action', () => {
			const strokes = initialState.json.content.undoableScenes.present[0].strokes;
			const fetchAction = actions.fetchShapeCandidates(strokes);
			const generator = fetchShapeCandidates(fetchAction);
			const next = generator.next();
			const desiredCall = call(actions.requestShapeCandidates, strokes);
			expect(next.value.CALL.fn.name).to.deep.equal(desiredCall.CALL.fn.name);
		});
	});
});
