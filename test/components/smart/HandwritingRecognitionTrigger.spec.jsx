import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

const WrappedComponent = () => <div />;

const HandwritingRecognizerComponent = HandwritingRecognitionTrigger(WrappedComponent);

describe('Handwriting Recognition Trigger', () => {
	let firstStroke;
	let secondStroke;
	let thirdStroke;

	beforeEach(() => {
		firstStroke = {};
		secondStroke = {};
		thirdStroke = {
			finished: true,
		};
	});

	describe('initializes', () => {
		it('with disables handwriting recognition', () => {
			const props = {};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.state.useHandwritingRecognition).to.be.false();
		});
	});

	describe('asking to recognize', () => {
		it('succeeds if recognition is enabled, return key was pressed and nothing was drawn after that', () => {
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.doRecognize()).to.be.true();
		});

		it('fails if recognition is disabled', () => {
			const props = {
				handwritingRecognitionEnabled: false,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.doRecognize()).to.be.false();
		});

		it('fails if recognition is enabled but return key is not pressed', () => {
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: false,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.doRecognize()).to.be.false();
		});

		it('fails if scene is not the last one drawn', () => {
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [secondStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.doRecognize()).to.be.false();
		});

		it('fails if last stroke was not finished yet', () => {
			thirdStroke.finished = false;
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			expect(trigger.doRecognize()).to.be.false();
		});
	});

	describe('triggering a recognize', () => {
		it('enables the recognition', () => {
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			trigger.componentDidUpdate();
			expect(trigger.state.useHandwritingRecognition).to.be.true();
		});

		it('with handwriting recognition disabled leaves handwriting recognition off', () => {
			const props = {
				handwritingRecognitionEnabled: false,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			trigger.componentDidUpdate();
			expect(trigger.state.useHandwritingRecognition).to.be.false();
		});
	});

	describe('changing anything after a recognition', () => {
		it('disables the recognition', () => {
			const fourthStroke = {};
			const props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke],
				},
			};
			const trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props} />);
			trigger.componentDidUpdate();
			trigger.props.strokes.push(fourthStroke);
			trigger.componentDidUpdate();
			expect(trigger.state.useHandwritingRecognition).to.be.false();
		});
	});
});
