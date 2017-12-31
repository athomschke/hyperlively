import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Checkbox from 'src/client/app/components/smart/Checkbox';

describe('Checkbox', () => {
	it('setting checkbox to checked changes nothing', () => {
		const checkbox = TestUtils.renderIntoDocument(<Checkbox />);
		expect(checkbox.props.checked).to.be.true();
		TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input'));
		expect(checkbox.props.checked).to.be.true();
	});
});
