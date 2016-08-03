import Window from 'components/dumb/Window';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Window', () => {
		
	it('setting cmdPressed to true disables events on window', () => {
		let windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
			cmdPressed={true}
		></Window>)
		expect(windowComponent.refs.window.style.getPropertyValue('pointer-events')).to.equal('none')
	})
	
	it('setting cmdPressed to false enables events on window', () => {
		let windowComponent = TestUtils.renderIntoDocument(<Window
			width={100}
			height={100}
			cmdPressed={false}
		></Window>)
		expect(windowComponent.refs.window.style.getPropertyValue('pointer-events')).to.equal('auto')
	})

})