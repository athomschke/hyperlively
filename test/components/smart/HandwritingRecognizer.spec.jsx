import HandwritingRecognizer from 'components/smart/HandwritingRecognizer';
import { point } from '../../helpers';
import React from 'react';
import { TEXT_INPUT_TYPE, LANGUAGE, TEXT_INPUT_MODE } from 'constants/handwriting';
import TestUtils from 'react-addons-test-utils';


describe('HandwritingRecognizer', () => {

	let recognizer;
	let xhr;
	let requests;

	beforeEach(() => {
		class WrappedComponent extends React.Component {

			render () {
				return <div></div>;
			}
		}

		let HandwritingRecognizerComponent = HandwritingRecognizer(WrappedComponent);
		xhr = sinon.useFakeXMLHttpRequest();
		recognizer = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent />);
		requests = [];
		xhr.onCreate = (request) => {
			requests.push(request);
		};
	});

	afterEach(() => {
		xhr.restore();
	});

	it('converts 2 strokes in 2 components', () => {
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
		let request = recognizer.xmlHttpRequest(() => {});
		expect(request).to.exist;
	});

	it('parses the candidates from a result', () => {
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
		let length = requests.length;
		recognizer.props.strokes.push({
			points: [point(10,11,12), point(13,14,15), point(16,17,18)],
			finished: true
		});
		recognizer.componentDidUpdate();
		expect(requests.length).to.equal(length + 1);
	});

	it('can recognize again when a new stroke is added', () => {
		let length = requests.length;
		recognizer.props.strokes.push({
			points: [point(10,11,12), point(13,14,15), point(16,17,18)],
			finished: true
		});
		recognizer.componentDidUpdate();
		recognizer.props.strokes.push({
			points: [point(19,20,21), point(22,23,24)]
		});
		recognizer.componentDidUpdate();
		recognizer.props.strokes[1].points.push(point(25,26,27));
		recognizer.props.strokes[1].finished = true;
		recognizer.componentDidUpdate();
		expect(requests.length).to.equal(length + 2);
	});

	it('recognizing empty array of strokes is possible', () => {
		let length = requests.length;
		recognizer.componentDidUpdate();
		expect(true).to.be.true;
	});

});