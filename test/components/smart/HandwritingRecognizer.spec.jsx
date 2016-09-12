import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import { point } from '../../helpers';
import React, { Component, PropTypes } from 'react';
import { TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import TestUtils from 'react-addons-test-utils';
import { first, concat, reduce, initial, last } from 'lodash';

const drawStroke = (wrapper, stroke) => {
	let oldStrokes = wrapper.state.strokes || [];
	let fullStroke = reduce(initial(stroke), (previousPoints, point) => {	
		let fullStroke = concat(previousPoints, [point]);
		wrapper.setState({
			strokes: (concat, oldStrokes, [{
				points: fullStroke
			}])
		});
		return fullStroke;
	}, first(stroke));
	wrapper.setState({
		strokes: (concat, oldStrokes, [{
			points: (concat, fullStroke, [last(stroke)]),
			finished: true
		}])
	});
};

const renderWithProps = (props) => {
	class WrappedComponent extends React.Component {
		render () {
			return <div></div>;
		}
	}
	let HandwritingRecognizerComponent = HandwritingRecognizer(WrappedComponent);
	return TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
};

const Wrapper = (HandwritingRecognizerComponent) => class extends Component {

	static propTypes = {
		strokes: PropTypes.array,
		useHandwritingRecognition: PropTypes.bool
	};

	static defaultProps = {
		strokes: [],
		useHandwritingRecognition: false
	}

	componentDidMount() {
		this.setState({
			strokes: [],
			useHandwritingRecognition: false
		});
	}

	render() {
		return <HandwritingRecognizerComponent {...this.props} {...this.state}/>;
	}
};

const renderWrappedWithProps = (props) => {
	class WrappedComponent extends React.Component {
		render () {
			return <div></div>;
		}
	}
	let HandwritingRecognizerComponent = Wrapper(HandwritingRecognizer(WrappedComponent));
	return TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
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

	it('is disabled per default', () => {
		let recognizer = renderWithProps({});
		let length = requests.length;
		recognizer.props.strokes.push({
			points: [point(10,11,12), point(13,14,15), point(16,17,18)],
			finished: true
		});
		recognizer.componentDidUpdate();
		expect(requests.length).to.equal(length);
	});

	it('converts 2 strokes in 2 components', () => {
		let recognizer = renderWithProps({
			ctrlPressed: true,
			useHandwritingRecognition: true
		});
		let strokes = [{
			points: [point(10,11,12), point(13,14,15), point(16,17,18)]
		}, {
			points: [point(19,20,21), point(22,23,24), point(25,26,27)]
		}];
		let result = recognizer.strokesToComponents(strokes);
		let components = [{
			type: 'stroke',
			x: [10,13,16],
			y: [11,14,17],
			t: [12,15,18]
		}, {
			type: 'stroke',
			x: [19,22,25],
			y: [20,23,26],
			t: [21,24,27]
		}];
		expect(result).to.deep.equal(components);
	});

	it('Creates the correct textInput object for request', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: true,
			ctrlPressed: true
		});
		let testInput = JSON.stringify({
			textParameter: {
				textProperties: {},
				language: LANGUAGE,
				textInputMode: TEXT_INPUT_MODE
			},
			inputUnits: [{
				textInputType: TEXT_INPUT_TYPE,
				components: 'foobar'
			}]
		});
		let result = recognizer.getStringInput('foobar');
		expect(result).to.deep.equal(testInput);
	});

	it('Creates an xmlhttprequest', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: true,
			ctrlPressed: true
		});
		let request = recognizer.xmlHttpRequest(() => {});
		expect(request).to.exist;
	});

	it('parses the candidates from a result', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: true,
			ctrlPressed: true
		});
		let request = {
			readyState: 4,
			status: 200,
			responseText: JSON.stringify({
				result: {
					textSegmentResult: {
						candidates: [{ label: 'a' }, { label: 'b' }, { label: 'c' }]
					}
				}
			})
		};
		recognizer.onReadyStateChange(request);
		expect(recognizer.state.candidates).to.have.length(3);
		expect(recognizer.state.candidates[0].label).to.equal('a');
	});

	it('creates a request when a stroke is added and finished', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: true,
			ctrlPressed: true
		});
		let length = requests.length;
		recognizer.props.strokes.push({
			points: [point(10,11,12), point(13,14,15), point(16,17,18)],
			finished: true
		});
		recognizer.componentDidUpdate();
		expect(requests.length).to.equal(length + 1);
	});

	it('can recognize again when a new stroke is added', () => {
		let wrapper = renderWrappedWithProps({
			useHandwritingRecognition: false,
			returnPressed: true
		});
		drawStroke(wrapper, [point(10,11,12), point(13,14,15), point(16,17,18)]);
		wrapper.setState({
			useHandwritingRecognition: true
		});
		expect(requests.length).to.equal(1);
		wrapper.setState({
			useHandwritingRecognition: false
		});
		drawStroke(wrapper, [point(19,20,21), point(22,23,24)]);
		wrapper.setState({
			useHandwritingRecognition: true
		});
		expect(requests.length).to.equal(2);
		wrapper.setState({
			useHandwritingRecognition: false
		});
		expect(requests.length).to.equal(2);
	});

	it('Informs the user if a circle was drawn', () => {
		let detected = false;
		let wrapper = renderWrappedWithProps({
			onCircleDetected: () => {detected = true;},
			useHandwritingRecognition: false,
			returnPressed: true
		});
		drawStroke(wrapper, [point(324, 211), point(320, 210), point(304, 205), point(292, 203), point(283, 202), point(275, 202), point(267, 202), point(262, 205), point(255, 211), point(252, 217), point(247, 225), point(245, 232), point(244, 240), point(244, 248), point(244, 256), point(244, 265), point(247, 272), point(253, 280), point(259, 288), point(266, 295), point(273, 299), point(283, 302), point(292, 304), point(303, 305), point(314, 305), point(325, 303), point(336, 298), point(342, 294), point(350, 288), point(355, 282), point(359, 278), point(362, 273), point(364, 269), point(366, 264), point(367, 258), point(367, 253), point(367, 249), point(367, 244), point(366, 240), point(363, 236), point(359, 233), point(354, 229), point(350, 227), point(345, 225), point(341, 223), point(337, 222), point(333, 221), point(328, 220), point(325, 220), point(322, 219), point(321, 219), point(320, 219), point(319, 219), point(319, 218), point(319, 217), point(318, 217), point(318, 217)]);
		wrapper.setState({
			useHandwritingRecognition: true
		});
		expect(requests.length).to.equal(1);
		requests[0].respond(200, {
			'Content-Type': 'application/json',
			readyState: 4
		}, JSON.stringify({
			result: {
				textSegmentResult: {
					candidates: [{
						label: 'O'
					}]
				}
			}
		}));
		expect(detected).to.be.true;
	});

	it('Initializes an onCircleDetected per default', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: false,
			returnPressed: true
		});
		recognizer.props.onCircleDetected();
		expect(true).to.be.true;
	});

	it('recognizing empty array of strokes is possible', () => {
		let recognizer = renderWithProps({
			useHandwritingRecognition: true,
			ctrlPressed: true
		});
		recognizer.componentDidUpdate();
		expect(true).to.be.true;
	});

});