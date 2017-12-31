import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

import AppConfiguration from 'src/client/app/components/dumb/AppConfiguration';

describe('App Configuration', () => {
	it('renders all its children', () => {
		const appConfiguration = TestUtils.renderIntoDocument(
			<AppConfiguration>
				<div />
				<div />
				<div />
			</AppConfiguration>);
		const domNode = findDOMNode(appConfiguration);
		expect(domNode.childNodes).to.have.length(3);
	});

	it('is active by default', () => {
		const appConfiguration = TestUtils.renderIntoDocument(<AppConfiguration />);
		const domNode = findDOMNode(appConfiguration);
		expect(domNode.style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('can be deactivated', () => {
		const appConfiguration = TestUtils.renderIntoDocument(
			<AppConfiguration
				active={false}
			/>);
		const domNode = findDOMNode(appConfiguration);
		expect(domNode.style.getPropertyValue('pointer-events')).to.equal('none');
	});

	it('can be activated', () => {
		const appConfiguration = TestUtils.renderIntoDocument(
			<AppConfiguration
				active
			/>);
		const domNode = findDOMNode(appConfiguration);
		expect(domNode.style.getPropertyValue('pointer-events')).to.equal('auto');
	});
});
