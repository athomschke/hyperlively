import Interpreter from 'components/smart/Interpreter';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

const shapeCandidateFactory = (type) => {
	let result = require('json!./data/recognizedShape.json');
	let candidates = result.segments[0].candidates;
	candidates[0].label = type;
	return candidates;
};

const renderWithProps = (props) => {
	class WrappedComponent extends React.Component {
		render () {
			return <div></div>;
		}
	}
	let InterpreterComponent = Interpreter(WrappedComponent);
	return TestUtils.renderIntoDocument(<InterpreterComponent {...props}/>);
};

describe('Interpreter', () => {

	describe('rendering', () => {

		it('wraps a handed component', () => {
			let interpreter = renderWithProps({});
			expect(interpreter).to.exist;
		});
	});


	describe('distinguishing results', () => { 

		let interpreter;

		beforeEach(() => {
			interpreter = renderWithProps({});
		});

		it('interprets a lowercase o as a circle', () => {
			let detected = interpreter.onTextDetected([{
				label: 'o'
			}]);
			expect(detected).to.equal('circle');
		});

		it('interprets an uppercase O as a circle', () => {
			let detected = interpreter.onTextDetected([{
				label: 'O'
			}]);
			expect(detected).to.equal('circle');
		});

		it('does not interpret an I', () => {
			let detected = interpreter.onTextDetected([{
				label: 'I'
			}]);
			expect(detected).to.not.equal('circle');
		});

		it('finds an arrow', () => {
			let detected = interpreter.findArrowInCandidates(shapeCandidateFactory('arrow'));
			expect(detected).to.exist;
		});

		it('finds a curved arrow', () => {
			let detected = interpreter.findArrowInCandidates(shapeCandidateFactory('curved arrow'));
			expect(detected).to.exist;
		});

		it('ignores a stroke', () => {
			let detected = interpreter.findArrowInCandidates(shapeCandidateFactory('stroke'));
			expect(detected).to.not.exist;
		});
		
	});

	describe('interpreting arrows', () => {

		it('does nothing without a callback', () => {
			let interpreter = renderWithProps({});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			expect(interpreter).to.exist;
		});

		it('gets the distance with which an object should move', () => {
			let calledWith;
			let interpreter = renderWithProps({
				onMove: (moveArgument) => {
					calledWith = moveArgument;
				}
			});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			expect(calledWith.x).to.equal(10);
			expect(calledWith.y).to.equal(10);
		});

		it('ignores non-arrow shapes', () => {
			let calledWith = {};
			let interpreter = renderWithProps({
				onMove: (moveArgument) => {
					calledWith = moveArgument;
				}
			});
			interpreter.onShapeDetected(shapeCandidateFactory('foobar'));
			expect(calledWith).to.not.be.defined;
		});

	});
	
});