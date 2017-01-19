import Interpreter from 'components/smart/Interpreter';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { tail, forEach } from 'lodash';

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

let sketchesAroundPoint55 = () => {
	return [{
		strokes: [{
			points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
		}]
	}, {
		// the arrow itself
		strokes: [{
			points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
		}]
	}];
};

describe('Interpreter', () => {

	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

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

		it('wants to detect an action in a character', () => {
			sinon.spy(interpreter, 'chooseAction');
			interpreter.onTextDetected([{
				label: 'I'
			}]);
			expect(interpreter.chooseAction.callCount).to.equal(1);
		});

		it('shows floats as such even if text was detected', () => {
			interpreter.onTextDetected([{
				label: '1'
			}]);
			expect(interpreter.state.interpretation.candidate.text.label).to.equal(1);
		});

		it('shows text and shape results', () => {
			interpreter.onTextDetected([{
				label: 'I'
			}]);
			interpreter.onShapeDetected([{
				label: 'arrow'
			}]);
			expect(interpreter.state.interpretation.candidate.text).to.exist;
			expect(interpreter.state.interpretation.candidate.shape).to.exist;
		});
		
	});

	describe('interpreting arrows', () => {

		it('does nothing without a callback', () => {
			let interpreter = renderWithProps({});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			expect(interpreter).to.exist;
		});

		it('ignores non-arrow shapes', () => {
			let moveByArgument;
			let interpreter = renderWithProps({
				onUpdatePosition: (strokes, moveBy) => {
					moveByArgument = moveBy;
				},
				sketches: sketchesAroundPoint55()
			});
			interpreter.onShapeDetected(shapeCandidateFactory('foobar'));
			expect(moveByArgument).to.not.be.defined;
		});

		it('does nothing if no callback is given', () => {
			let interpreter = renderWithProps({
				sketches: sketchesAroundPoint55()
			});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			expect(true).to.be.true; 
		});

		it('does nothing if there is no match', () => {
			let moveByArgument;
			let sketches = sketchesAroundPoint55();
			sketches = tail(sketches);
			let interpreter = renderWithProps({
				onUpdatePosition: (strokes, moveBy) => {
					moveByArgument = moveBy;
				},
				sketches: sketches
			});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			expect(moveByArgument).to.not.be.defined;
		});

	});

	describe('allowing to choose', () => {

		it('renders an action chooser', () => {
			let list = renderWithProps({});
			list.setState({
				interpretation: {}
			});
			expect(list.refs.actionChooser.props.isOpen).to.be.true;
		});

	});

	describe('Choosing an action', () => {

		let list;

		beforeEach(() => {
			list = renderWithProps({});
			list.setState({
				interpretation: {}
			});
		});

		it('removes the list', () => {
			sinon.spy(list, 'deactivateInterpretation');
			list.performAction({}, 'updatePosition');
			expect(list.deactivateInterpretation.callCount).to.equal(1);
			list.deactivateInterpretation.restore();
		});
	});

	describe('searching sketches at a given point', () => {

		it('finds one where the point is in the center', () => {
			let interpreter = renderWithProps({
				sketches: [{
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}]
			});
			let sketches = interpreter.findSketchesAtPoint({ x: 5, y: 5 });
			expect(sketches).to.have.length(1);
		});

		it('rejects one that doesn\'t contain the point', () => {
			let allSketches = [{
				strokes: [{
					points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
				}]
			}, {
				strokes: [{
					points: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }]
				}]
			}, {
				strokes: [{
					points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
				}]
			}];
			let interpreter = renderWithProps({
				sketches: allSketches
			});
			let sketches = interpreter.findSketchesAtPoint({ x: 5, y: 5 });
			expect(sketches).to.have.length(1);
		});

		it('finds two where the point is in the center', () => {
			let interpreter = renderWithProps({
				sketches: [{
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}]
			});
			let sketches = interpreter.findSketchesAtPoint({ x: 5, y: 5 });
			expect(sketches).to.have.length(2);
		});

	});

	describe('performing an interpreted action', () => {

		it('chooses a routine in the form of onDoSomething for type doSomething and runs it', () => {
			let performedActionName;
			let interpreter = renderWithProps({
				performAction: (actionName) => {
					performedActionName = actionName;
				}
			});
			interpreter.setState({
				interpretation: {}
			});
			interpreter.performAction({}, 'foobarRun');
			expect(performedActionName).to.equal('foobarRun');
		});

		it('at first hides strokes even without callback', () => {
			let interpreter = renderWithProps({
				sketches: [{
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }]
					}]
				}]
			});
			interpreter.setState({
				interpretation: {}
			});
			interpreter.performAction({}, 'foobarRun');
			expect(interpreter).to.exist;
		});
	});
	
});