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
			parameters: ['parameter1', 'parameter2'],
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
			parameters: ['parameter1', 'parameter2', 'parameter3'],
		});
		const result = 'ActionWithTwoParameters(parameter1, parameter2) then ActionWithOneParameter(parameter3)';
		expect(interpretationDisplay.text()).to.equal(result);
	});
});
