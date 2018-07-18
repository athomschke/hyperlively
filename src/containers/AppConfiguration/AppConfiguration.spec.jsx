// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AppConfiguration, { type AppConfigurationProps } from './AppConfiguration';

const renderComponentWithProps = (
	props: AppConfigurationProps,
) => shallow(<AppConfiguration {...props} />);

describe('App Configuration', () => {
	it('renders all its children', () => {
		const children = () => [1, 2, 3].map(index => <div key={`${index}`} />);
		const appConfiguration = renderComponentWithProps({ children: children(), active: false });
		expect(appConfiguration.prop('children')).to.have.length(3);
	});

	it('can be activated', () => {
		const appConfiguration = renderComponentWithProps({ children: null, active: true });
		expect(appConfiguration.find('div').prop('style').pointerEvents).to.equal('auto');
	});

	it('can be deactivated', () => {
		const appConfiguration = renderComponentWithProps({ children: null, active: false });
		expect(appConfiguration.find('div').prop('style').pointerEvents).to.equal('none');
	});
});
