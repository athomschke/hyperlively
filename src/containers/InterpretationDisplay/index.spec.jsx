// @flow
import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { InterpretationDisplay, type InterpretationDisplayProps } from '.';

const shallowWithProps = (
	props: InterpretationDisplayProps,
) => shallow(<InterpretationDisplay {...props} />);

describe('InterpretationDisplay', () => {
	it('renders no selection as empty string', () => {
		const interpretationDisplay = shallowWithProps({
			functions: [],
			parameters: [],
		});
		const result = '';
		expect(interpretationDisplay.prop('children')).to.equal(result);
	});

	it('renders a function with parameters', () => {
		const interpretationDisplay = shallowWithProps({
			functions: [{
				name: 'ActionWithTwoParameters',
				parameters: 2,
			}],
			parameters: ['parameter1', 'parameter2'],
		});
		const result = 'ActionWithTwoParameters(parameter1, parameter2)';
		expect(interpretationDisplay.prop('children')).to.equal(result);
	});

	it('renders two functions with parameters', () => {
		const interpretationDisplay = shallowWithProps({
			functions: [{
				name: 'ActionWithTwoParameters',
				parameters: 2,
			}, {
				name: 'ActionWithOneParameter',
				parameters: 1,
			}],
			parameters: ['parameter1', 'parameter2', 'parameter3'],
		});
		const result = 'ActionWithTwoParameters(parameter1, parameter2) then ActionWithOneParameter(parameter3)';
		expect(interpretationDisplay.prop('children')).to.equal(result);
	});
});
