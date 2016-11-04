import AppConfiguration from 'components/dumb/AppConfiguration';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('App Configuration', () => {

	it('renders all its children', () => {
		let appConfiguration = TestUtils.renderIntoDocument(<AppConfiguration><div/><div/><div/></AppConfiguration>);
		let domNode = findDOMNode(appConfiguration);
		expect(domNode.childNodes).to.have.length(3);
	});

	it('can be deactivated', () => {
		let appConfiguration = TestUtils.renderIntoDocument(<AppConfiguration
			active={false}
		></AppConfiguration>);
		let domNode = findDOMNode(appConfiguration);
		expect(domNode.style.getPropertyValue('pointer-events')).to.equal('none');
	});

	it('can be activated', () => {
		let appConfiguration = TestUtils.renderIntoDocument(<AppConfiguration
			active={true}
		></AppConfiguration>);
		let domNode = findDOMNode(appConfiguration);
		expect(domNode.style.getPropertyValue('pointer-events')).to.equal('auto');
	});
});