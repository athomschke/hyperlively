import HandwritingRecognitionTrigger from 'components/smart/HandwritingRecognitionTrigger';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

class WrappedComponent extends React.Component {
	render () {
		return <div></div>;
	}
}

let HandwritingRecognizerComponent = HandwritingRecognitionTrigger(WrappedComponent);

describe('Handwriting Recognition Trigger', () => {
		
	let firstStroke = {};
	let secondStroke = {};
	let thirdStroke = {
		finished: true
	};
	
	describe('initializes', () => {

		it('with disables handwriting recognition', () => {
			let props = {};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.state.handwritingRecognitionEnabled).to.be.false;
		});

	});

	describe('asking to recognize', () => {

		it('succeeds if recognition is enabled, return key was pressed and nothing was drawn after that', () => {
			let props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke]
				}
			};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.doRecognize()).to.be.true;

		});

		it('fails if recognition is disabled', () => {
			let props = {
				handwritingRecognitionEnabled: false,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke]
				}
			};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.doRecognize()).to.be.false;
		});

		it('fails if recognition is enabled but return key is not pressed', () => {
			let props = {
				handwritingRecognitionEnabled: true,
				returnPressed: false,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke]
				}
			};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.doRecognize()).to.be.false;
		});

		it('fails if scene is not the last one drawn', () => {
			let props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [secondStroke]
				}
			};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.doRecognize()).to.be.false;
		});

		it('fails if last stroke was not finished yet', () => {
			thirdStroke.finished = false;
			let props = {
				handwritingRecognitionEnabled: true,
				returnPressed: true,
				strokes: [firstStroke, secondStroke, thirdStroke],
				scene: {
					strokes: [thirdStroke]
				}
			};
			let trigger = TestUtils.renderIntoDocument(<HandwritingRecognizerComponent {...props}/>);
			expect(trigger.doRecognize()).to.be.false;
		});

	});
});