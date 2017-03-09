import React, { Component } from 'react';
import { first, concat, reduce, initial, last } from 'lodash';
import TestUtils from 'react-addons-test-utils';
import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import { point } from '../../helpers';
import textPoints from './data/textPoints';
import shapePoints from './data/shapePoints';
import recognizedText from './data/recognizedText.json';
import recognizedShapeResult from './data/recognizedShape.json';

const drawStroke = (wrapper, stroke) => {
	const oldStrokes = wrapper.state.strokes || [];
	const fullStroke = reduce(initial(stroke), (previousPoints, aPoint) => {
		const fullPoints = concat(previousPoints, [aPoint]);
		wrapper.setState({
			strokes: (concat, oldStrokes, [{
				points: fullPoints,
			}]),
		});
		return fullPoints;
	}, first(stroke));
	wrapper.setState({
		strokes: (concat, oldStrokes, [{
			points: (concat, fullStroke, [last(stroke)]),
			finished: true,
		}]),
	});
};

const renderWithProps = (props) => {
	const WrappedComponent = () => <div />;
	const HandwritingRecognizerComponent = HandwritingRecognizer(WrappedComponent);
	return TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
};

const Wrapper = HandwritingRecognizerComponent => class extends Component {

	componentDidMount() {
		this.setState({
			strokes: [],
			useHandwritingRecognition: false,
		});
	}

	render() {
		return <HandwritingRecognizerComponent {...this.props} {...this.state} />;
	}
};

const renderWrappedWithProps = (props) => {
	const WrappedComponent = () => <div />;
	const HandwritingRecognizerComponent = Wrapper(HandwritingRecognizer(WrappedComponent));
	return TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
};

describe('HandwritingRecognizer', () => {
	let xhr;
	let requests;

	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		requests = [];
		xhr.onCreate = (request) => {
			requests.push(request);
		};
	});

	afterEach(() => {
		xhr.restore();
	});

	describe('initializing the component', () => {
		it('disables recognition per default', () => {
			const recognizer = renderWithProps({});
			const length = requests.length;
			recognizer.props.strokes.push({
				points: [point(10, 11, 12), point(13, 14, 15), point(16, 17, 18)],
				finished: true,
			});
			recognizer.componentDidUpdate();
			expect(requests.length).to.equal(length);
		});
	});

	describe('requesting handwritin recognition for text', () => {
		it('creates an xmlhttprequest', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
			});
			const request = recognizer.xmlHttpRequest('', () => {});
			expect(request).to.exist();
		});
	});

	describe('interpreting the recognized text', () => {
		it('parses the candidates from a result', () => {
			let candidates;
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
				onTextDetected: (arg1) => {
					candidates = arg1;
				},
			});
			const request = {
				readyState: 4,
				status: 200,
				responseText: JSON.stringify({
					result: {
						textSegmentResult: {
							candidates: [{ label: 'a' }, { label: 'b' }, { label: 'c' }],
						},
					},
				}),
			};
			recognizer.onReadyStateChange(request);
			expect(candidates).to.have.length(3);
			expect(candidates[0].label).to.equal('a');
		});

		it('does not parse bad results', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
			});
			const request = {
				readyState: 4,
				status: 404,
				responseText: '{5',
			};
			const myFunction = () => recognizer.onReadyStateChange(request);
			expect(myFunction).not.to.throw(Error);
		});

		it('does not parse answers without result', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
			});
			const request = {
				readyState: 4,
				status: 200,
				responseText: JSON.stringify({
					result: null,
				}),
			};
			sinon.spy(recognizer, 'dispatchResult');
			recognizer.onReadyStateChange(request);
			expect(recognizer.dispatchResult.callCount).to.equal(0);
			recognizer.dispatchResult.restore();
		});

		it('Informs the user if a text was drawn', () => {
			let detected = false;
			const wrapper = renderWrappedWithProps({
				onTextDetected: () => { detected = true; },
				useHandwritingRecognition: false,
				returnPressed: true,
			});
			drawStroke(wrapper, textPoints());
			wrapper.setState({
				useHandwritingRecognition: true,
			});
			expect(requests.length).to.equal(2);
			requests[0].respond(200, {
				'Content-Type': 'application/json',
				readyState: 4,
			}, JSON.stringify({
				result: recognizedText,
			}));
			expect(detected).to.be.true();
		});

		it('Informs the user if a shape was drawn', () => {
			let detected = false;
			const wrapper = renderWrappedWithProps({
				onShapeDetected: () => { detected = true; },
				useHandwritingRecognition: false,
				returnPressed: true,
			});
			drawStroke(wrapper, shapePoints());
			wrapper.setState({
				useHandwritingRecognition: true,
			});
			expect(requests.length).to.equal(2);
			requests[0].respond(200, {
				'Content-Type': 'application/json',
				readyState: 4,
			}, JSON.stringify({
				result: recognizedShapeResult,
			}));
			expect(detected).to.be.true();
		});

		it('does nothing when no callback is defined', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: false,
				returnPressed: true,
			});
			recognizer.props.onTextDetected();
			expect(true).to.be.true();
		});

		it('does nothing if no candidates were found', () => {
			let ranCallback = false;
			const recognizer = renderWithProps({
				onTextDetected: () => {
					ranCallback = true;
				},
			});
			recognizer.dispatchResult({
				textSegmentResult: {
					candidates: [],
				},
			});
			expect(ranCallback).to.be.false();
		});
	});

	describe('Interpreting the recognized shape', () => {
		it('does nothing when no callback is defined', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: false,
				returnPressed: true,
			});
			recognizer.props.onShapeDetected();
			expect(true).to.be.true();
		});

		it('does nothing if no candidates were found', () => {
			let ranCallback = false;
			const recognizer = renderWithProps({
				onShapeDetected: () => {
					ranCallback = true;
				},
			});
			recognizer.dispatchResult({
				segments: [],
			});
			expect(ranCallback).to.be.false();
		});
	});

	describe('automatically triggering recognition', () => {
		it('recognizing empty array of strokes is possible', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
			});
			recognizer.componentDidUpdate();
			expect(true).to.be.true();
		});

		it('creates a request when a stroke is added and finished', () => {
			const recognizer = renderWithProps({
				useHandwritingRecognition: true,
				ctrlPressed: true,
			});
			const length = requests.length;
			recognizer.props.strokes.push({
				points: [point(10, 11, 12), point(13, 14, 15), point(16, 17, 18)],
				finished: true,
			});
			recognizer.componentDidUpdate();
			expect(requests.length).to.equal(length + 2);
		});

		it('can recognize again when a new stroke is added', () => {
			const wrapper = renderWrappedWithProps({
				useHandwritingRecognition: false,
				returnPressed: true,
			});
			drawStroke(wrapper, [point(10, 11, 12), point(13, 14, 15), point(16, 17, 18)]);
			wrapper.setState({
				useHandwritingRecognition: true,
			});
			expect(requests.length).to.equal(2);
			wrapper.setState({
				useHandwritingRecognition: false,
			});
			drawStroke(wrapper, [point(19, 20, 21), point(22, 23, 24)]);
			wrapper.setState({
				useHandwritingRecognition: true,
			});
			expect(requests.length).to.equal(4);
			wrapper.setState({
				useHandwritingRecognition: false,
			});
			expect(requests.length).to.equal(4);
		});
	});
});
