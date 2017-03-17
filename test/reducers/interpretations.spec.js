import { find } from 'lodash';
import { toggleInterpreter, recognizeHandwriting } from 'actions/configuring';
import { interpretation } from 'reducers/interpretation';
import { DEFAULT_PEN_COLOR } from 'constants/drawing';
import { TEXT_RECOGNITION_URL, SHAPE_RECOGNITION_URL } from 'constants/handwriting';

const shapeCandidate = {
	type: 'recognizedShape',
	label: 'line',
	primitives: {
		type: 'line',
		firstPoint: {
			x: 100,
			y: 100,
		},
		lastPoint: {
			x: 100,
			y: 120,
		},
		beginDecoration: 'none',
		endDecoration: 'none',
		beginTangentAngle: 'none',
		endTangentAngle: 'none',
	},
	normalizedRecognitionScore: 0.9,
	resemblanceScore: 0.8,
};

const shapeResponse = {
	readyState: 4,
	status: 200,
	responseText: JSON.stringify({
		result: {
			segments: [{
				elementType: 'shape',
				selectedCandidateIndex: 0,
				candidates: [shapeCandidate],
			}],
		},
	}),
};

const letterCandidate = {
	label: 'I',
	normalizedScore: 0.7,
	resemblanceScore: 0.6,
};

const textResponse = {
	readyState: 4,
	status: 200,
	responseText: JSON.stringify({
		result: {
			textSegmentResult: {
				selectedCandidateIdx: 0,
				candidates: [letterCandidate],
			},
		},
	}),
};

const strokesExample = [{
	points: [{
		x: 100,
		y: 100,
		timeStamp: 50,
	}, {
		x: 100,
		y: 120,
		timeStamp: 52,
	}],
	hidden: false,
	selected: false,
	finished: true,
	color: DEFAULT_PEN_COLOR,
}];

const dummyState = {
	showInterpreter: false,
	interpretations: {
		candidate: {
			shape: null,
			text: null,
		},
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
	});

	describe('recognizing a handwriting', () => {
		let textRecognizerRequest;
		let shapeRecognizerRequest;

		beforeEach(() => {
			interpretation(dummyState, recognizeHandwriting(strokesExample));
			textRecognizerRequest = find(requests, request =>
				request.url === TEXT_RECOGNITION_URL);
			shapeRecognizerRequest = find(requests, request =>
				request.url === SHAPE_RECOGNITION_URL);
		});

		it('sends out two requests', () => {
			expect(requests).to.have.length(2);
		});

		it('sends out a test recognition request', () => {
			expect(textRecognizerRequest).to.exist();
		});

		it('sends out a shape recognition request', () => {
			expect(shapeRecognizerRequest).to.exist();
		});
	});
});
