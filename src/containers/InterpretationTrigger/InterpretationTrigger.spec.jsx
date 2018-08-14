// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import React from 'react';
import { forEach } from 'lodash';
import { shallow } from 'enzyme';
import { spy, stub } from 'sinon';

import InterpretationChooser from 'src/containers/InterpretationChooser';
import ActionChooser from 'src/containers/ActionChooser';
import type { Parameters, Functions } from 'src/types';

import InterpretationTrigger, { type InterpretationTriggerProps } from './InterpretationTrigger';

const defaultProps = (): InterpretationTriggerProps => ({
	interpretations: { shapes: [], texts: [] },
	onInterpretationDone: () => undefined,
	showInterpreter: true,
	specificActions: [],
	functions: [],
	parameters: [],
	performAction: () => undefined,
	setInterval: () => 1,
	clearInterval: () => undefined,
});

const findElementOfTypeWithTextContent = (
	wrapper,
	type,
	content,
) => wrapper.findWhere(n => n.type() === type && n.text().indexOf(content) >= 0);

const renderWithProps = (props: InterpretationTriggerProps) => shallow(<InterpretationTrigger {...props} />);

describe('Interpreter', () => {
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
		cleanup();
	});

	describe('rendering', () => {
		let interpreter;

		beforeEach(() => {
			interpreter = renderWithProps(defaultProps());
		});

		it('renders an interpretationChooser', () => {
			expect(interpreter).to.exist();
		});

		it('renders a parameter chooser', () => {
			expect(interpreter.find(InterpretationChooser)).to.exist();
		});

		it('renders an action chooser', () => {
			expect(interpreter.find(ActionChooser)).to.exist();
		});

		it('renders a button to accept the interpretation', () => {
			expect(findElementOfTypeWithTextContent(interpreter, 'button', 'Accept')).to.have.length(1);
		});

		it('renders a button to start ticking', () => {
			expect(findElementOfTypeWithTextContent(interpreter, 'button', 'Tick')).to.have.length(1);
		});
	});

	describe('Accepting an interpretation', () => {
		it('calls performAction', () => {
			const performAction = spy();
			const functions: Functions = [{
				name: 'doSomethingWith',
				parameters: ['a'],
				path: ['1'],
			}];
			const parameters: Parameters = [{ value: 'aProp', path: [] }];
			const list = renderWithProps({
				...defaultProps(), performAction, functions, parameters,
			});

			const acceptButton = findElementOfTypeWithTextContent(list, 'button', 'Accept');
			acceptButton.simulate('click');
			expect(performAction.callCount).to.equal(1);
		});

		it('passes the chosen arguments', () => {
			const performAction = spy();
			const functions: Functions = [{
				name: 'doSomethingWith',
				parameters: ['a'],
				path: ['1'],
			}];
			const parameters: Parameters = [{ value: 'aProp', path: [] }];
			const list = renderWithProps({
				...defaultProps(), functions, parameters, performAction,
			});

			const acceptButton = findElementOfTypeWithTextContent(list, 'button', 'Accept');
			acceptButton.simulate('click');
			expect(performAction.args[0][0]).to.deep.equal(functions[0].name);
			expect(performAction.args[0][1]).to.deep.equal(parameters[0]);
		});

		it('dones the interpretation with true', () => {
			const onInterpretationDone = spy();
			let tickedAction = () => undefined;
			const setInterval = (anAction: () => void, interval: number) => { tickedAction = anAction; return interval; };
			const interpretationTrigger = renderWithProps({
				...defaultProps(),
				onInterpretationDone,
				setInterval,
			});
			const acceptButton = interpretationTrigger.findWhere(
				wrapper => wrapper.text() === 'Accept Interpretation' && wrapper.type() === 'button',
			);
			acceptButton.simulate('click');
			tickedAction();
			expect(onInterpretationDone.args[0][0]).to.be.true();
		});
	});

	describe('Accepting multiple interpretations', () => {
		it('performs them all', () => {
			const performAction = spy();
			const functions: Functions = [{
				name: 'doSomethingWith',
				parameters: ['a'],
				path: ['1'],
			}];
			const parameters: Parameters = [{ value: 'aProp', path: [] }];
			const list = renderWithProps({
				...defaultProps(), performAction, functions, parameters,
			});

			const acceptButton = findElementOfTypeWithTextContent(list, 'button', 'Accept');
			acceptButton.simulate('click');

			expect(performAction.callCount).to.equal(1);
		});

		it('passes the chosen arguments', () => {
			const performAction = spy();
			const functions: Functions = [{
				name: 'runWithTwoParameters',
				parameters: ['one', 'two'],
				path: ['1'],
			}, {
				name: 'runWithOneParameter',
				parameters: ['one'],
				path: ['1'],
			}];
			const parameters: Parameters = [{ value: 1, path: [] }, { value: 2, path: [] }, { value: 3, path: [] }];
			const list = renderWithProps({
				...defaultProps(), functions, parameters, performAction,
			});

			const acceptButton = findElementOfTypeWithTextContent(list, 'button', 'Accept');
			acceptButton.simulate('click');
			expect(performAction.args[0][0]).to.equal('runWithTwoParameters');
			expect(performAction.args[0][1].value).to.equal(1);
			expect(performAction.args[0][2].value).to.equal(2);
			expect(performAction.args[1][0]).to.equal('runWithOneParameter');
			expect(performAction.args[1][1].value).to.equal(3);
		});
	});

	describe('Ticking an action', () => {
		it('lets it tick forever without a fourth parameter', () => {
			const performAction = spy();
			const setInterval = stub();
			const clearInterval = spy();
			const parameters = ['aParam', 'bParam'];
			const values = [{ value: 'a', path: [] }, { value: 'b', path: [] }];
			const functions = [{ name: 'action', parameters, path: ['1'] }];
			const interpreter = renderWithProps({
				...defaultProps(),
				performAction,
				setInterval,
				functions,
				parameters: values,
			});

			const tickButton = findElementOfTypeWithTextContent(interpreter, 'button', 'Tick');
			tickButton.simulate('click');

			expect(setInterval).to.have.been.calledOnce();
			const timeout = setInterval.getCall(0).args[0];
			const interval = setInterval.getCall(0).args[1];
			expect(interval).to.equal(1000);
			timeout();
			expect(performAction.args[0]).to.eql(['action', { value: 'a', path: [] }, { value: 'b', path: [] }]);
			expect(clearInterval.callCount).to.equal(0);
		});

		it('dones the interpretation with false', () => {
			const onInterpretationDone = spy();
			let tickedAction = () => undefined;
			const setInterval = (anAction: () => void, interval: number) => { tickedAction = anAction; return interval; };
			const interpretationTrigger = renderWithProps({
				...defaultProps(),
				onInterpretationDone,
				setInterval,
			});
			const tickButton = interpretationTrigger.findWhere(
				wrapper => wrapper.text() === 'Tick' && wrapper.type() === 'button',
			);
			tickButton.simulate('click');
			tickedAction();
			expect(onInterpretationDone.args[0][0]).to.be.false();
		});

		it.skip('stops after n ticks if given', () => {
			const performAction = spy();
			const setInterval = stub();
			const intervalId = 1234;
			setInterval.returns(intervalId);
			const clearInterval = stub();
			const functions = [{ name: 'action', parameters: ['a', 'b'], path: ['1'] }];
			const parameters = [{ value: 'a', path: [] }, { value: 'b', path: [] }];

			const interpreter = renderWithProps({
				...defaultProps(), performAction, setInterval, clearInterval, functions, parameters,
			});

			const tickButton = findElementOfTypeWithTextContent(interpreter, 'button', 'Tick');
			tickButton.simulate('click');

			expect(setInterval).to.have.been.calledOnce();
			const timeout = setInterval.getCall(0).args[0];
			const interval = setInterval.getCall(0).args[1];
			expect(interval).to.equal(1000);
			timeout();
			expect(performAction.args[0]).to.eql(['action', 'a', 'b']);
			expect(clearInterval).to.not.have.been.called();
			timeout();
			expect(performAction.args[1]).to.eql(['action', 'a', 'b']);
			expect(clearInterval).to.have.been.calledOnce();
			expect(clearInterval).to.have.been.calledWith(intervalId);
		});
	});
});
