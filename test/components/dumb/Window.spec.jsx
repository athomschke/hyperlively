import React from 'react';
import { mount } from 'enzyme';
import Window from 'components/dumb/Window';

describe('Window', () => {
	it('setting cmdPressed to true disables events on window', () => {
		const windowComponent = mount(<Window
			width={100}
			height={100}
			cmdPressed
		/>);
		expect(windowComponent.find('div').node.style.getPropertyValue('pointer-events')).to.equal('none');
	});

	it('setting cmdPressed to false enables events on window', () => {
		const windowComponent = mount(<Window
			width={100}
			height={100}
			cmdPressed={false}
		/>);
		expect(windowComponent.find('div').node.style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('enables events per default', () => {
		const windowComponent = mount(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.find('div').node.style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('has the given width', () => {
		const windowComponent = mount(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.find('div').node.style.getPropertyValue('width')).to.equal('100px');
	});

	it('has the given height', () => {
		const windowComponent = mount(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.find('div').node.style.getPropertyValue('height')).to.equal('100px');
	});
});
