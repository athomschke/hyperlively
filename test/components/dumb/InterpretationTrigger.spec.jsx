// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';

import InterpretationTrigger from 'src/client/app/containers/InterpretationTrigger/InterpretationTrigger';

describe('InterpretationTrigger', () => {
	describe('Clicking', () => {
		it('clicking does nothing without a callback', () => {
			const trigger = shallow(<InterpretationTrigger />);
			trigger.find('button').simulate('click');
			expect(trigger).to.exist();
		});

		it('triggers a callback given', () => {
			const onHandwritingRecognitionClick = spy();
			const trigger = shallow(<InterpretationTrigger
				onHandwritingRecognitionClick={onHandwritingRecognitionClick}
			/>);
			trigger.find('button').simulate('click');
			expect(onHandwritingRecognitionClick.callCount).to.equal(1);
		});
	});
});
