import Interpreter from 'components/smart/Interpreter';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import actions from 'actions/actions';
import { tail } from 'lodash';

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
			let interpreter = renderWithProps({
				onUpdatePosition: () => { },
				sketches: sketchesAroundPoint55()
			});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			let moveByArgument = interpreter.state.interpretation;
			expect(moveByArgument).to.exist;
			expect(moveByArgument.x).to.equal(10);
			expect(moveByArgument.y).to.equal(10);
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

		it('removes the arrow afterwards', () => {
			let hiddenStrokes;
			let arrowSketch = {
				strokes: [{
					points: [{ x: 1, y: 6 }, { x: 6, y: 1 }, { x: 11, y: 6 }, { x: 6, y: 11 }]
				}]
			};
			let sketches = sketchesAroundPoint55();
			sketches.push(arrowSketch);
			let interpreter = renderWithProps({
				onHide: (strokes) => {
					hiddenStrokes = strokes;
				},
				onUpdatePosition: () => {},
				sketches: sketches
			});
			interpreter.onShapeDetected(shapeCandidateFactory('arrow'));
			interpreter.performAction({}, 'updatePosition');
			expect(hiddenStrokes).to.be.defined;
			expect(hiddenStrokes).to.have.length(1);
			expect(hiddenStrokes[0]).to.equal(arrowSketch.strokes[0]);
		});

	});

	describe('allowing to choose', () => {

		it('renders a list', () => {
			let list = renderWithProps({});
			list.setState({
				interpretation: {}
			});
			expect(list.refs.list.props.items.length).to.not.equal(0);
		});

		it('renders an item for each available action type', () => {
			let list = renderWithProps({});
			list.setState({
				interpretation: {}
			});
			expect(list.refs.list.props.items).to.have.length(Object.keys(actions).length);
		});

		it('opens a modal dialog', () => {
			let list = renderWithProps({});
			list.setState({
				interpretation: {}
			});
			expect(list.refs.modal.props.isOpen).to.be.true;
		});

	});

	describe('Choosing an action', () => {

		let list;
		let performed = false;

		beforeEach(() => {
			list = renderWithProps({
				onUpdatePosition: () => {
					performed = true;
				}
			});
			list.setState({
				interpretation: {}
			});
			performed = false;
		});

		it('removes the list', () => {
			sinon.spy(list, 'deactivateInterpretation');
			list.performAction({}, 'updatePosition');
			expect(list.deactivateInterpretation.callCount).to.equal(1);
			list.deactivateInterpretation.restore();
		});

		it('performs the action', () => {
			list.refs.list.props.onItemClick({}, 'updatePosition');
			expect(performed).to.be.true;
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
			let foobarCalled = false;
			let interpreter = renderWithProps({
				onFoobarRun: () => {
					foobarCalled = true;
				}
			});
			interpreter.setState({
				interpretation: {}
			});
			interpreter.performAction({}, 'foobarRun');
			expect(foobarCalled).to.be.true;
		});

	});
	
});