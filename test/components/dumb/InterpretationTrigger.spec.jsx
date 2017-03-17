import { shallow } from 'enzyme';
import React from 'react';
import InterpretationTrigger from 'components/dumb/InterpretationTrigger';

describe('InterpretationTrigger', () => {
	describe('Clicking', () => {
		it('clicking does nothing without a callback', () => {
			const trigger = shallow(<InterpretationTrigger />);
			trigger.find('button').simulate('click');
			expect(trigger).to.exist();
		});

		it('triggers a callback given', () => {
			const spy = sinon.spy();
			const trigger = shallow(<InterpretationTrigger
				onHandwritingRecognitionClick={spy}
			/>);
			trigger.find('button').simulate('click');
			expect(spy.callCount).to.equal(1);
		});
	});
});
