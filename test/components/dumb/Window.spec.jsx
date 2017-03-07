import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Window from 'components/dumb/Window';

describe('Window', () => {
	it('setting cmdPressed to true disables events on window', () => {
		const windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
			cmdPressed
		/>);
		expect(windowComponent.refs.window.style.getPropertyValue('pointer-events')).to.equal('none');
	});

	it('setting cmdPressed to false enables events on window', () => {
		const windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
			cmdPressed={false}
		/>);
		expect(windowComponent.refs.window.style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('enables events per default', () => {
		const windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.refs.window.style.getPropertyValue('pointer-events')).to.equal('auto');
	});

	it('has the given width', () => {
		const windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.refs.window.style.getPropertyValue('width')).to.equal('100px');
	});

	it('has the given height', () => {
		const windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
		/>);
		expect(windowComponent.refs.window.style.getPropertyValue('height')).to.equal('100px');
	});
});
