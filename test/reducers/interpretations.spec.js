import { requestTextCandidates, requestShapeCandidates, receiveTextCandidates, receiveShapeCandidates } from 'src/client/app/actions/handwritingRecognition';
import { toggleInterpreter } from 'src/client/app/actions/configuring';
import { createStroke } from 'src/client/app/actions/drawing';
import { interpretation } from 'src/client/app/reducers/interpretation';
import { shapeCandidate, letterCandidate } from 'test/data';

const dummyState = {
	showInterpreter: false,
	interpretations: {
		shape: [],
		text: [],
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
					text: null,
					shapes: [shapeCandidate],
				},
			});
			const newState = interpretation(oldState, createStroke(10, 10, 101));
			expect(newState.interpretations.shapes).to.be.empty();
		});

		it('Invalidates the last text interpretation', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: false,
				interpretations: {
					text: letterCandidate,
					shapes: [],
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
					text: letterCandidate,
					shapes: [shapeCandidate],
				},
			});
			const newState = interpretation(oldState, requestTextCandidates());
			expect(newState.interpretations.text).to.exist();
			expect(newState.interpretations.shapes).not.to.be.empty();
		});
	});

	describe('Requesting a shape recognition result', () => {
		it('does not (yet) invalidate recent interpretaitons', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					text: letterCandidate,
					shapes: [shapeCandidate],
				},
			});
			const newState = interpretation(oldState, requestShapeCandidates());
			expect(newState.interpretations.text).to.exist();
			expect(newState.interpretations.shapes).not.to.be.empty();
		});
	});

	describe('Receiving a text recognition result', () => {
		it('displays a new text recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					text: [],
					shapes: [],
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate]));
			expect(newState.interpretations.text[0].label).to.equal('I');
			expect(newState.interpretations.shapes).to.be.empty();
		});

		it('appends to old existing results', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					text: [Object.assign({}, letterCandidate, {
					shapes: [shapeCandidate],
						label: 'K',
					})],
				},
			});
			const newState = interpretation(oldState, receiveTextCandidates([letterCandidate]));
			expect(newState.interpretations.text[1].label).to.equal('I');
			expect(newState.interpretations.text).to.have.length(2);
		});
	});

	describe('Receiving a shape recognition result', () => {
		it('displays a new shape recognition result', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					text: [],
					shapes: [],
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate]));
			expect(newState.interpretations.text[0]).to.not.exist();
			expect(newState.interpretations.shapes[0].label).to.equal('line');
		});
		it('appends new results to existing ones', () => {
			const oldState = Object.assign({}, dummyState, {
				showInterpreter: true,
				interpretations: {
					shapes: [Object.assign({}, shapeCandidate, {
						label: 'arrow',
					})],
					text: [letterCandidate],
				},
			});
			const newState = interpretation(oldState, receiveShapeCandidates([shapeCandidate]));
			expect(newState.interpretations.text[0]).to.deep.equal(letterCandidate);
			expect(newState.interpretations.shapes).to.have.length(2);
			expect(newState.interpretations.shapes[1].label).to.equal('line');
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
					text: [letterCandidate],
					shapes: [shapeCandidate],
				},
			});
			const newState = interpretation(oldState, toggleInterpreter(false));
			expect(newState.interpretations.text[0]).to.exist();
			expect(newState.interpretations.shapes[0]).to.exist();
		});
	});
});
