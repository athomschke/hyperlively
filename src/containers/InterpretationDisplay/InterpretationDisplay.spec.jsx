// @flow
import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import InterpretationDisplay, { type InterpretationDisplayProps } from './InterpretationDisplay';

const shallowWithProps = (
	props: InterpretationDisplayProps,
) => shallow(<InterpretationDisplay {...props} />);

const defaultProps = (): InterpretationDisplayProps => ({
	functions: [],
	parameters: [],
	onActionClick: () => undefined,
	onParameterClick: () => undefined,
});

describe('InterpretationDisplay', () => {
	it('renders no selection as empty string', () => {
		const interpretationDisplay = shallowWithProps(defaultProps());
		const result = '';
		expect(interpretationDisplay.text()).to.equal(result);
	});

	it('renders a function with parameters', () => {
		const interpretationDisplay = shallowWithProps({
			...defaultProps(),
			functions: [{
				name: 'ActionWithTwoParameters',
				parameters: ['one', 'two'],
			}],
			parameters: [{ value: 'parameter1', path: [] }, { value: 'parameter2', path: [] }],
		});
		const result = 'ActionWithTwoParameters(parameter1, parameter2)';
		expect(interpretationDisplay.text()).to.equal(result);
	});

	it('renders two functions with parameters', () => {
		const interpretationDisplay = shallowWithProps({
			...defaultProps(),
			functions: [{
				name: 'ActionWithTwoParameters',
				parameters: ['one', 'two'],
			}, {
				name: 'ActionWithOneParameter',
				parameters: ['one'],
			}],
			parameters: [{ value: 'parameter1', path: [] }, { value: 'parameter2', path: [] }, { value: 'parameter3', path: [] }],
		});
		const result = 'ActionWithTwoParameters(parameter1, parameter2) then ActionWithOneParameter(parameter3)';
		expect(interpretationDisplay.text()).to.equal(result);
	});

	it('renders placeholders for unchosen parameters', () => {
		const interpretationDisplay = shallowWithProps({
			...defaultProps(),
			functions: [{
				name: 'ActionWithTwoParameters',
				parameters: ['one', 'two'],
			}, {
				name: 'ActionWithOneParameter',
				parameters: ['one'],
			}],
			parameters: [{ value: 'parameter1', path: [] }],
		});
		const result = 'ActionWithTwoParameters(parameter1, two) then ActionWithOneParameter(one)';
		expect(interpretationDisplay.text()).to.equal(result);
	});
});
