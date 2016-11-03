import Ploma from 'components/dumb/Ploma';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Ploma Configuration', () => {

	it('labels the button Ploma', () => {
		let component = TestUtils.renderIntoDocument(<Ploma></Ploma>);
		let domNode = findDOMNode(component);
		expect(domNode.textContent).to.equal('Use Ploma');
	});
});