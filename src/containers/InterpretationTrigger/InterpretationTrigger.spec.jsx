// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';

import InterpretationTrigger, { type InterpretationTriggerProps } from './InterpretationTrigger';

const defaultProps = (): InterpretationTriggerProps => ({
	onHandwritingRecognitionClick: () => {},
	interpretation: {
		texts: [],
		shapes: [],
	},
	sketches: [],
});

const shallowWithProps = (props: InterpretationTriggerProps) => shallow(<InterpretationTrigger {...props} />);

describe('InterpretationTrigger', () => {
	describe('Clicking', () => {
		it('clicking does nothing without a callback', () => {
			const trigger = shallowWithProps(defaultProps());
			trigger.find('button').simulate('click');
			expect(trigger).to.exist();
		});

		it('triggers a callback given', () => {
			const onHandwritingRecognitionClick = spy();
			const trigger = shallowWithProps({ ...defaultProps(), onHandwritingRecognitionClick });
			trigger.find('button').simulate('click');
			expect(onHandwritingRecognitionClick.callCount).to.equal(1);
		});
	});
});
