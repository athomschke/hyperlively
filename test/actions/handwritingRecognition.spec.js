// @flow
import { expect } from 'chai';

import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import { strokesExample } from 'test/data';
import type { TextCandidate } from 'src/client/app/typeDefinitions';

describe('src/client/app/actions', () => {
	it('Should create an action to request a text candidate', () => {
		const strokes = strokesExample;
		const expectedAction = {
			type: 'REQUEST_TEXT_CANDIDATES',
			strokes,
		};
		expect(requestTextCandidates(strokes)).to.deep.equal(expectedAction);
	});

	it('Should create an action to request a shape candidate', () => {
		const strokes = strokesExample;
		const expectedAction = {
			type: 'REQUEST_SHAPE_CANDIDATES',
			strokes,
		};
		expect(requestShapeCandidates(strokes)).to.deep.equal(expectedAction);
	});

	it('Should create an action to receive a text candidate', () => {
		const candidates: Array<TextCandidate> = [];
		const expectedAction = {
			type: 'RECEIVE_TEXT_CANDIDATES',
			candidates,
		};
		expect(receiveTextCandidates(candidates)).to.deep.equal(expectedAction);
	});

	it('Should create an action to receive a shape candidate', () => {
		const candidates = [];
		const expectedAction = {
			type: 'RECEIVE_SHAPE_CANDIDATES',
			candidates,
		};
		expect(receiveShapeCandidates(candidates)).to.deep.equal(expectedAction);
	});
});
