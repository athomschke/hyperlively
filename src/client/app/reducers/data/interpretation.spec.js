// @flow
import { useFakeXMLHttpRequest } from 'sinon';
import { expect } from 'chai';

import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates, toggleInterpreter, createStroke } from 'src/client/app/actionCreators';
import { type InterpretationState } from 'src/client/app/types';
import { shapeCandidate, letterCandidate } from 'src/client/app/data.spec';

import { interpretation } from './interpretation';

const dummyState: InterpretationState = {
	showInterpreter: false,
	interpretations: {
		shapes: [],
		texts: [],
	},
};

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
				...dummyState,
				showInterpreter: false,
				interpretations: {
					shapes: [shapeCandidate()],
					texts: [],
				},
			};
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.interpretations.shapes).to.be.empty();
		});

		it('Invalidates the last text interpretation', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: false,
				interpretations: {
					shapes: [],
					texts: [letterCandidate()],
				},
			});
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.interpretations.texts).to.be.empty();
		});
	});

	describe('Requesting a text recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [shapeCandidate()],
					texts: [letterCandidate()],
				},
			});
			const newState = interpretation(oldState, requestTextCandidates([]));
			expect(newState.interpretations.texts).not.to.be.empty();
			expect(newState.interpretations.shapes).not.to.be.empty();
		});
	});

	describe('Requesting a shape recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [shapeCandidate()],
					texts: [letterCandidate()],
				},
			});
			const newState = interpretation(oldState, requestShapeCandidates([]));
			expect(newState.interpretations.texts).not.to.be.empty();
			expect(newState.interpretations.shapes).not.to.be.empty();
		});
	});

	describe('Receiving a text recognition result', () => {
		it('displays a new text recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [],
					texts: [],
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate()]));
			expect(newState.interpretations.texts[0].label).to.equal('I');
			expect(newState.interpretations.shapes).to.be.empty();
		});

		it('appends to old existing results', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [shapeCandidate()],
					texts: [Object.assign({}, letterCandidate(), {
						label: 'K',
						normalizedScore: 0.9,
						resemblanceScore: 0.95,
					})],
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate()]));
			expect(newState.interpretations.texts[1].label).to.equal('I');
			expect(newState.interpretations.texts).to.have.length(2);
		});
	});

	describe('Receiving a shape recognition result', () => {
		it('displays a new shape recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [],
					texts: [],
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate()]));
			expect(newState.interpretations.shapes[0].label).to.equal('line');
			expect(newState.interpretations.texts[0]).to.not.exist();
		});
		it('appends new results to existing ones', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [Object.assign({}, shapeCandidate(), {
						label: 'arrow',
					})],
					texts: [letterCandidate()],
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate()]));
			expect(newState.interpretations.shapes).to.have.length(2);
			expect(newState.interpretations.shapes[1].label).to.equal('line');
			expect(newState.interpretations.texts[0]).to.deep.equal(letterCandidate());
		});
	});
});
