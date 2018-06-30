// @flow
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';

import Window from 'src/client/app/containers/Window/Window';

describe('Window', () => {
	it('setting cmdPressed to true disables events on window', () => {
		const windowComponent = mount(<Window
			cmdPressed
		/>);
		expect(windowComponent.find('div').getNode().style.getPropertyValue('pointer-events')).to.equal('none');
	});

	it('setting cmdPressed to false enables events on window', () => {
		const windowComponent = mount(<Window
			cmdPressed={false}
		/>);
		expect(windowComponent.find('div').getNode().style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('enables events per default', () => {
		const windowComponent = mount(<Window />);
		expect(windowComponent.find('div').getNode().style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('has the default width', () => {
		const windowComponent = mount(<Window />);
		expect(windowComponent.find('div').getNode().style.getPropertyValue('width')).to.equal('60%');
	});
});
