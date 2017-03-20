import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates } from 'actions/handwritingRecognition';
import { toggleInterpreter } from 'actions/configuring';
import { createStroke } from 'actions/drawing';
import { interpretation } from 'reducers/interpretation';
import { shapeCandidate, letterCandidate } from '../data';

const dummyState = {
	showInterpreter: false,
	interpretations: {
		shape: null,
		text: null,
	},
};

describe('Interpretation reducer', () => {
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

	describe('Drawing', () => {
		it('Invalidates the last shape interpretation', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: false,
				interpretations: {
					shape: shapeCandidate,
					text: null,
				},
			});
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.interpretations.shape).to.be.null();
		});

		it('Invalidates the last text interpretation', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: false,
				interpretations: {
					shape: null,
					text: letterCandidate,
				},
			});
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.interpretations.text).to.be.null();
		});
	});

	describe('Requesting a text recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: shapeCandidate,
					text: letterCandidate,
				},
			});
			const newState = interpretation(oldState, requestTextCandidates());
			expect(newState.interpretations.text).to.exist();
			expect(newState.interpretations.shape).to.exist();
		});
	});

	describe('Requesting a shape recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: shapeCandidate,
					text: letterCandidate,
				},
			});
			const newState = interpretation(oldState, requestShapeCandidates());
			expect(newState.interpretations.text).to.exist();
			expect(newState.interpretations.shape).to.exist();
		});
	});

	describe('Receiving a text recognition result', () => {
		it('displays a new text recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: null,
					text: null,
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate]));
			expect(newState.interpretations.text.label).to.equal('I');
			expect(newState.interpretations.shape).to.not.exist();
		});
		it('overwrites an old text results and leaves the existing shape result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: shapeCandidate,
					text: Object.assign({}, letterCandidate, {
						label: 'K',
					}),
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate]));
			expect(newState.interpretations.text.label).to.equal('I');
			expect(newState.interpretations.shape).to.deep.equal(shapeCandidate);
		});
	});

	describe('Receiving a shape recognition result', () => {
		it('displays a new shape recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: null,
					text: null,
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate]));
			expect(newState.interpretations.shape.label).to.equal('line');
			expect(newState.interpretations.text).to.not.exist();
		});
		it('overwrites an old shape results and leaves the existing text result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: Object.assign({}, shapeCandidate, {
						label: 'arrow',
					}),
					text: letterCandidate,
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate]));
			expect(newState.interpretations.shape.label).to.equal('line');
			expect(newState.interpretations.text).to.deep.equal(letterCandidate);
		});
	});

	describe('toggling the display of the interpreter', () => {
		it('sets the state flag to true', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: false,
			});
			const newState = interpretation(oldState, toggleInterpreter(true));
			expect(newState.showInterpreter).to.be.true();
		});

		it('sets the state flag to false', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
			});
			const newState = interpretation(oldState, toggleInterpreter(false));
			expect(newState.showInterpreter).to.be.false();
		});

		it('does not invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shape: shapeCandidate,
					text: letterCandidate,
				},
			});
			const newState = interpretation(oldState, toggleInterpreter(false));
			expect(newState.interpretations.text).to.exist();
			expect(newState.interpretations.shape).to.exist();
		});
	});
});
