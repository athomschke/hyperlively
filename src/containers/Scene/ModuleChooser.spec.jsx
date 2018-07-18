// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

import ModuleChooser from './ModuleChooser';

const MockedSubComponent1 = () => <canvas />;
const MockedSubComponent2 = () => <span />;
const MockedComponent = ModuleChooser([MockedSubComponent1, MockedSubComponent2]);

describe('ModuleChooser', () => {
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	it('chooses an existing module at index 1', () => {
		const parent = mount(<MockedComponent componentIndex={0} />);
		expect(parent.find(MockedSubComponent1)).to.have.length(1);
		expect(parent.find(MockedSubComponent2)).to.have.length(0);
	});

	it('chooses an existing module at index 2', () => {
		const parent = mount(<MockedComponent componentIndex={1} />);
		expect(parent.find(MockedSubComponent1)).to.have.length(0);
		expect(parent.find(MockedSubComponent2)).to.have.length(1);
	});

	it('always returns some Component', () => {
		const parent = mount(<MockedComponent componentIndex={2} />);
		expect(parent.find(MockedSubComponent1)).to.have.length(0);
		expect(parent.find(MockedSubComponent2)).to.have.length(0);
		expect(parent.find('div')).to.have.length(1);
	});
});
