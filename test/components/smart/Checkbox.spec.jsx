// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

import Checkbox from 'src/client/app/components/smart/Checkbox';

describe('Checkbox', () => {
	it('setting checkbox to checked changes nothing', () => {
		const checkbox = TestUtils.renderIntoDocument(<Checkbox />);
		expect(checkbox.props.checked).to.be.true();
		const checkboxNode = TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input');
		if (!checkboxNode) throw new Error('Need a checkboxNode');
		TestUtils.Simulate.change(checkboxNode);
		expect(checkbox.props.checked).to.be.true();
	});
});
