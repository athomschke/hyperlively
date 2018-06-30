// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import * as React from 'react';

import LabelledBox from './LabelledBox';

describe('LabelledBox', () => {
	it('toggling without a callback does not change the checked state', () => {
		const ploma = TestUtils.renderIntoDocument(<LabelledBox />);
		const previousValue = ploma.props.checked;
		const plomaInput = TestUtils.findRenderedDOMComponentWithTag(ploma, 'input');
		if (!plomaInput) {
			throw new Error('ploma needs to be rendered');
		}
		TestUtils.Simulate.click(plomaInput);
		expect(ploma.props.checked).to.equal(previousValue);
	});

	it('calls callback with true when not checked and clicked', () => {
		let value = false;
		const ploma = TestUtils.renderIntoDocument(<LabelledBox
			checked={false}
			onChange={(bool) => {
				value = bool;
			}}
		/>);
		const plomaInput = TestUtils.findRenderedDOMComponentWithTag(ploma, 'input');
		if (!plomaInput) {
			throw new Error('ploma needs to be rendered');
		}
		TestUtils.Simulate.click(plomaInput);
		expect(value).to.be.true();
	});

	it('displays the label', () => {
		const ploma = TestUtils.renderIntoDocument(<LabelledBox
			label={'Foobar'}
		/>);
		const labelNode = TestUtils.scryRenderedDOMComponentsWithTag(ploma, 'span')[0];
		expect(labelNode.textContent).to.equal('Foobar');
	});
});
