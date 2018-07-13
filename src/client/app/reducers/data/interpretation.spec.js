// @flow
import { useFakeXMLHttpRequest } from 'sinon';
import { expect } from 'chai';

import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates, createStroke } from 'src/client/app/actionCreators';
import { type RecognitionResult } from 'src/client/app/types';
import { shapeCandidate, letterCandidate } from 'src/client/app/data.spec';

import { interpretation } from './interpretation';

const dummyState = (): RecognitionResult => ({
	shapes: [],
	texts: [],
});

describe('Interpretation reducer', () => {
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

	describe('Drawing', () => {
		it('Invalidates the last shape interpretation', () => {
			const oldState = {
				...dummyState(),
				shapes: [shapeCandidate()],
			};
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.shapes).to.be.empty();
		});

		it('Invalidates the last text interpretation', () => {
			const oldState = {
				...dummyState(),
				texts: [letterCandidate()],
			};
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.texts).to.be.empty();
		});
	});

	describe('Requesting a text recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = {
				...dummyState(),
				shapes: [shapeCandidate()],
				texts: [letterCandidate()],
			};
			const newState = interpretation(oldState, requestTextCandidates([]));
			expect(newState.texts).not.to.be.empty();
			expect(newState.shapes).not.to.be.empty();
		});
	});

	describe('Requesting a shape recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = {
				...dummyState(),
				shapes: [shapeCandidate()],
				texts: [letterCandidate()],
			};
			const newState = interpretation(oldState, requestShapeCandidates([]));
			expect(newState.texts).not.to.be.empty();
			expect(newState.shapes).not.to.be.empty();
		});
	});

	describe('Receiving a text recognition result', () => {
		it('displays a new text recognition result', () => {
			const oldState = dummyState();
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate()], []));
			expect(newState.texts[0].label).to.equal('I');
			expect(newState.shapes).to.be.empty();
		});

		it('appends to old existing results', () => {
			const oldState = {
				...dummyState(),
				shapes: [shapeCandidate()],
				texts: [Object.assign({}, letterCandidate(), {
					label: 'K',
					normalizedScore: 0.9,
					resemblanceScore: 0.95,
				})],
			};
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate()], []));
			expect(newState.texts[1].label).to.equal('I');
			expect(newState.texts).to.have.length(2);
		});
	});

	describe('Receiving a shape recognition result', () => {
		it('displays a new shape recognition result', () => {
			const oldState = dummyState();
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate()], []));
			expect(newState.shapes[0].label).to.equal('line');
			expect(newState.texts[0]).to.not.exist();
		});
		it('appends new results to existing ones', () => {
			const oldState = {
				...dummyState(),
				shapes: [Object.assign({}, shapeCandidate(), {
					label: 'arrow',
				})],
				texts: [letterCandidate()],
			};
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate()], []));
			expect(newState.shapes).to.have.length(2);
			expect(newState.shapes[1].label).to.equal('line');
			expect(newState.texts[0]).to.deep.equal(letterCandidate());
		});
	});
});
