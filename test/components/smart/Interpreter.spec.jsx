import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { forEach } from 'lodash';
import Interpreter from 'components/smart/Interpreter';
import InterpretationChooser from 'components/smart/InterpretationChooser';

const renderWithProps = (props) => TestUtils.renderIntoDocument(<Interpreter {...props} />);

describe('Interpreter', () => {
	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

	describe('allowing to choose', () => {
		it('renders an action chooser', () => {
			const list = renderWithProps({
				interpretations: {},
				showInterpreter: true,
			});
			const interpretationChooser = TestUtils.scryRenderedComponentsWithType(
					list, InterpretationChooser)[0];
			expect(interpretationChooser.props.isOpen).to.equal(true);
		});
	});

	describe('Choosing an action', () => {
		let list;

		beforeEach(() => {
			list = renderWithProps({});
			list.setState({
				interpretation: {},
			});
		});

		it('Does nothing without a callback', () => {
			list.performAction([{
				name: 'foobar',
				parameters: 0,
			}], []);
			expect(list).to.exist();
		});

		it('removes the list', () => {
			sinon.spy(list, 'deactivateInterpretation');
			list.performAction({}, 'updatePosition');
			expect(list.deactivateInterpretation.callCount).to.equal(1);
			list.deactivateInterpretation.restore();
		});
	});

	describe('performing an interpreted action', () => {
		it('chooses a routine in the form of onDoSomething for type doSomething and runs it', () => {
			let performedActionName;
			const interpreter = renderWithProps({
				performAction: (actionName) => {
					performedActionName = actionName;
				},
			});
			interpreter.setState({
				interpretation: {},
			});
			interpreter.performAction([{
				name: 'foobarRun',
				parameters: 2,
			}], []);
			expect(performedActionName).to.equal('foobarRun');
		});

		it('can perform multiple actions', () => {
			const performedActions = [];
			const interpreter = renderWithProps({
				performAction: (...args) => {
					performedActions.push(args);
				},
			});
			interpreter.performAction([{
				name: 'runWithTwoParameters',
				parameters: 2,
			}, {
				name: 'runWithOneParameter',
				parameters: 1,
			}], [1, 2, 3]);
			expect(performedActions[0][0]).to.equal('runWithTwoParameters');
			expect(performedActions[0][1]).to.equal(1);
			expect(performedActions[0][2]).to.equal(2);
			expect(performedActions[1][0]).to.equal('runWithOneParameter');
			expect(performedActions[1][1]).to.equal(3);
		});

		it('at first hides strokes even without callback', () => {
			const interpreter = renderWithProps({
				sketches: [{
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}],
			});
			interpreter.setState({
				interpretation: {},
			});
			interpreter.performAction({}, 'foobarRun');
			expect(interpreter).to.exist();
		});
	});

	describe('Choosing selected strokes from sketches', () => {
		let interpreter;

		beforeEach(() => {
			interpreter = renderWithProps({
				sketches: [{
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}, {
					strokes: [{
						points: [{ x: 0, y: 5 }, { x: 5, y: 0 }, { x: 10, y: 5 }, { x: 5, y: 10 }],
					}],
				}],
			});
		});

		it('returns an empty array if none are selected', () => {
			expect(interpreter.getSelectedStrokes()).to.have.length(0);
		});

		it('returns an empty array if none are selected', () => {
			interpreter.props.sketches[0].strokes[0].selected = true;
			expect(interpreter.getSelectedStrokes()).to.have.length(1);
		});
	});

	describe('Letting actions tick', () => {
		let interpreter;
		let performedActionName;
		let performedActionParameters;
		let timeout;
		let interval;
		let clearedTimout;

		beforeEach(() => {
			interpreter = renderWithProps({
				performAction: (...args) => {
					performedActionName = args[0];
					performedActionParameters = args.slice(1);
				},
			});
			sinon.stub(window, 'setInterval', (aFunction, anInterval) => { timeout = aFunction; interval = anInterval; return aFunction; });
			sinon.stub(window, 'clearInterval', (aTimeout) => { clearedTimout = aTimeout; });
		});

		afterEach(() => {
			window.setInterval.restore();
			window.clearInterval.restore();
		});

		it('lets them tick forever without a fourth parameter', () => {
			interpreter.tickActions([{ name: 'action', parameters: 2 }], ['a', 'b'], 1000);
			expect(interval).to.equal(1000);
			timeout();
			expect(performedActionName).to.equal('action');
			expect(performedActionParameters[0]).to.equal('a');
			expect(performedActionParameters[1]).to.equal('b');
			expect(clearedTimout).to.be.undefined();
		});

		it('stops after n ticks if given', () => {
			interpreter.tickActions([{ name: 'action', parameters: 2 }], ['a', 'b'], 1000, 2);
			expect(interval).to.equal(1000);
			timeout();
			expect(performedActionName).to.equal('action');
			expect(performedActionParameters[0]).to.equal('a');
			expect(performedActionParameters[1]).to.equal('b');
			expect(clearedTimout).to.be.undefined();
			performedActionName = undefined;
			performedActionParameters = undefined;
			timeout();
			expect(performedActionName).to.equal('action');
			expect(performedActionParameters[0]).to.equal('a');
			expect(performedActionParameters[1]).to.equal('b');
			expect(clearedTimout).to.equal(timeout);
		});
	});
});
