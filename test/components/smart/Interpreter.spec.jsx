// @flow
import { expect } from 'chai';
import React from 'react';
import { forEach } from 'lodash';
import { shallow } from 'enzyme';
import { spy, stub } from 'sinon';

import Interpreter, { type InterpreterProps } from 'src/client/app/components/smart/Interpreter';
import InterpretationChooser from 'src/client/app/containers/InterpretationChooser';
import { exampleStrokes, point } from 'test/helpers';

const defaultProps: () => InterpreterProps = () => ({
	interpretations: { shapes: [], texts: [] },
	onInterpretationDone: () => undefined,
	showInterpreter: true,
	sketches: [],
	specificActions: [],
	performAction: () => undefined,
	setInterval: () => 1,
	clearInterval: () => undefined,
});

const renderWithProps = (props: InterpreterProps) =>
	shallow(<Interpreter {...props} />);

describe('Interpreter', () => {
	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

	describe('allowing to choose', () => {
		it('renders an action chooser', () => {
			const list = renderWithProps({
				...defaultProps(),
				interpretations: { shapes: [], texts: [] },
			});
			expect(list.find(InterpretationChooser).prop('isOpen')).to.equal(true);
		});

		it('renders the candidates already received from hw recognition', () => {
			const list = renderWithProps({
				...defaultProps(),
				interpretations: { shapes: [], texts: [] },
			});
			expect(list.find(InterpretationChooser).prop('isOpen')).to.equal(true);
		});
	});

	describe('Choosing an action', () => {
		let list;

		beforeEach(() => {
			list = renderWithProps({
				...defaultProps(),
				interpretations: { shapes: [], texts: [] },
			});
			list.setState({
				interpretation: {},
			});
		});

		it('Does nothing without a callback', () => {
			list.instance().performAction([{
				name: 'foobar',
				parameters: 0,
			}], []);
			expect(list).to.exist();
		});

		it('removes the list', () => {
			spy(list.instance(), 'deactivateInterpretation');
			list.instance().performAction({}, 'updatePosition');
			expect(list.instance().deactivateInterpretation.callCount).to.equal(1);
			list.instance().deactivateInterpretation.restore();
		});
	});

	describe('performing an interpreted action', () => {
		it('chooses a routine in the form of onDoSomething for type doSomething and runs it', () => {
			let performedActionName;
			const interpreter = renderWithProps({
				...defaultProps(),
				performAction: (actionName) => {
					performedActionName = actionName;
				},
				interpretations: {
					texts: [],
					shapes: [],
				},
			});
			interpreter.setState({
				interpretation: {},
			});
			interpreter.instance().performAction([{
				...defaultProps(),
				name: 'foobarRun',
				parameters: 2,
			}], []);
			expect(performedActionName).to.equal('foobarRun');
		});

		it('can perform multiple actions', () => {
			const performedActions = [];
			const interpreter = renderWithProps({
				...defaultProps(),
				performAction: (...args) => {
					performedActions.push(args);
				},
				interpretations: {
					texts: [],
					shapes: [],
				},
			});
			interpreter.instance().performAction([{
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
				...defaultProps(),
				sketches: [{
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}, {
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}, {
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}],
			});
			interpreter.setState({
				interpretation: {},
			});
			interpreter.instance().performAction({}, 'foobarRun');
			expect(interpreter).to.exist();
		});
	});

	describe('Choosing selected strokes from sketches', () => {
		let interpreter;

		beforeEach(() => {
			interpreter = renderWithProps({
				...defaultProps(),
				sketches: [{
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}, {
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}, {
					finished: true,
					strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
				}],
			});
		});

		it('returns an empty array if none are selected', () => {
			expect(interpreter.instance().getSelectedStrokes()).to.have.length(0);
		});

		it('returns a non empty array if none are selected', () => {
			interpreter.prop('sketches')[0].strokes[0].selected = true;
			expect(interpreter.instance().getSelectedStrokes()).to.have.length(1);
		});
	});

	describe('Letting actions tick', () => {
		let interpreter;
		let clearedTimout;

		beforeEach(() => {
			interpreter = renderWithProps({
				...defaultProps(),
				performAction: spy(),
				setInterval: stub(),
				clearInterval: stub(),
			});
		});

		it('lets them tick forever without a fourth parameter', () => {
			interpreter.instance().tickActions([{ name: 'action', parameters: 2 }], ['a', 'b'], 1000);
			expect(interpreter.prop('setInterval')).to.have.been.calledOnce();
			const timeout = interpreter.prop('setInterval').getCall(0).args[0];
			const interval = interpreter.prop('setInterval').getCall(0).args[1];
			expect(interval).to.equal(1000);
			timeout();
			expect(interpreter.prop('performAction').args[0]).to.eql(['action', 'a', 'b']);
			expect(clearedTimout).to.be.undefined();
		});

		it('stops after n ticks if given', () => {
			const intervalId = 1234;
			interpreter.prop('setInterval').returns(intervalId);
			interpreter.instance().tickActions([{ name: 'action', parameters: 2 }], ['a', 'b'], 1000, 2);
			expect(interpreter.prop('setInterval')).to.have.been.calledOnce();
			const timeout = interpreter.prop('setInterval').getCall(0).args[0];
			const interval = interpreter.prop('setInterval').getCall(0).args[1];
			expect(interval).to.equal(1000);
			timeout();
			expect(interpreter.prop('performAction').args[0]).to.eql(['action', 'a', 'b']);
			expect(interpreter.prop('clearInterval')).to.not.have.been.called();
			timeout();
			expect(interpreter.prop('performAction').args[1]).to.eql(['action', 'a', 'b']);
			expect(interpreter.prop('clearInterval')).to.have.been.calledOnce();
			expect(interpreter.prop('clearInterval')).to.have.been.calledWith(intervalId);
		});
	});
});
