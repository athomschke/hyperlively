import LabelledBox from 'components/dumb/LabelledBox';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('LabelledBox', () => {

	it('toggling without a callback does not change the checked state', () => {
		let ploma = TestUtils.renderIntoDocument(<LabelledBox></LabelledBox>);
		let previousValue = ploma.props.checked;
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
		expect(ploma.props.checked).to.equal(previousValue);
	});

	it('calls callback with true when not checked and clicked', () => {
		let value = false;
		let ploma = TestUtils.renderIntoDocument(<LabelledBox
			checked={false}
			onChange={(bool) => {
				value=bool;
			}}
		></LabelledBox>);
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
		expect(value).to.be.true;
	});

	it('displays the label', () => {
		let ploma = TestUtils.renderIntoDocument(<LabelledBox
			label={'Foobar'}
		></LabelledBox>);
		let labelNode = TestUtils.scryRenderedDOMComponentsWithTag(ploma, 'span')[0];
		expect(labelNode.textContent).to.equal('Foobar');
	});
});