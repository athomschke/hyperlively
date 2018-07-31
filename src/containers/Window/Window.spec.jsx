// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';

import Window from './Window';

const defaultProps = () => ({ cmdPressed: false });

describe('Window', () => {
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	it('setting cmdPressed to false enables events on window', () => {
		const windowComponent = mount(<Window {...defaultProps()} />);
		expect(windowComponent.find('div').prop('style').pointerEvents).to.equal('auto');
	});

	it('setting cmdPressed to true disables events on window', () => {
		const windowComponent = mount(<Window
			cmdPressed
		/>);
		expect(windowComponent.find('div').prop('style').pointerEvents).to.equal('none');
	});

	it('enables events per default', () => {
		const windowComponent = mount(<Window {...defaultProps()} />);
		expect(windowComponent.find('div').prop('style').pointerEvents).to.equal('auto');
	});

	it('has the default width', () => {
		const windowComponent = mount(<Window {...defaultProps()} />);
		expect(windowComponent.find('div').prop('style').width).to.equal('100%');
	});
});
