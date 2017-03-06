import Ploma from 'components/dumb/Ploma';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Ploma Configuration', () => {

	it('labels the button Ploma', () => {
		let component = Ploma({})
		expect(component.props.label).to.equal('Use Ploma');
	});
});