// @flow
import { expect } from 'chai';
import { filter } from 'lodash';
import { call } from 'redux-saga/effects';
import { useFakeXMLHttpRequest } from 'sinon';

import { requestTextCandidates, requestShapeCandidates } from 'src/actionCreators';
import { REQUEST_TEXT_CANDIDATES, REQUEST_SHAPE_CANDIDATES } from 'src/constants/actionTypes';
import canvasWithIrregularStrokesWithPloma from 'test/integration/data/canvasWithIrregularStrokesWithPloma';

import { myScriptJs, fetchTextCandidates, fetchShapeCandidates } from './myScriptJs';

describe('MyScriptJS Sagas', () => {
	let xhr;
	let requests = [];

	beforeEach(() => {
		xhr = useFakeXMLHttpRequest();
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
			const generator = myScriptJs();
			const items = [];
			let next = generator.next();
			while (next.value) {
				items.push(next);
				next = generator.next();
			}
			const text = filter(items,
				item => item.value.FORK.args[0] === REQUEST_TEXT_CANDIDATES);
			const shape = filter(items,
				item => item.value.FORK.args[0] === REQUEST_SHAPE_CANDIDATES);
			expect(text).to.exist();
			expect(shape).to.exist();
		});
	});

	describe('Text recognition saga', () => {
		it('yields a requestTextCandidates action', () => {
			const strokes = canvasWithIrregularStrokesWithPloma()
				.data.scenes.present[0].strokes;
			const fetchAction = requestTextCandidates(strokes);
			const generator = fetchTextCandidates(fetchAction);
			const nextValue = generator.next().value;
			const desiredCall = call(requestTextCandidates, strokes);
			if (nextValue) {
				expect(nextValue.CALL.fn.name).to.deep.equal(desiredCall.CALL.fn.name);
			} else {
				throw new Error('Generator should never end generating');
			}
		});
	});

	describe('Shape recognition saga', () => {
		it('yields a requestShapeCandidates action', () => {
			const strokes = canvasWithIrregularStrokesWithPloma()
				.data.scenes.present[0].strokes;
			const fetchAction = requestShapeCandidates(strokes);
			const generator = fetchShapeCandidates(fetchAction);
			const nextValue = generator.next().value;
			const desiredCall = call(requestShapeCandidates, strokes);
			if (nextValue) {
				expect(nextValue.CALL.fn.name).to.deep.equal(desiredCall.CALL.fn.name);
			} else {
				throw new Error('Generator should never end generating');
			}
		});
	});
});
