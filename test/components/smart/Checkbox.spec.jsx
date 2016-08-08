import Checkbox from 'components/smart/Checkbox';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers'

describe('Checkbox', () => {

	it('setting checkbox to checked changes nothing', () => {
		let checkbox = TestUtils.renderIntoDocument(<Checkbox></Checkbox>);
		expect(checkbox.props.checked).to.be.true;
		TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input'));
		expect(checkbox.props.checked).to.be.true;
	})
})