import TestUtils from 'react-addons-test-utils';
import React from 'react';
import LabelledBox from 'components/dumb/LabelledBox';

describe('LabelledBox', () => {
	it('toggling without a callback does not change the checked state', () => {
		const ploma = TestUtils.renderIntoDocument(<LabelledBox />);
		const previousValue = ploma.props.checked;
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
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
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
		expect(value).to.be.true;
	});

	it('displays the label', () => {
		const ploma = TestUtils.renderIntoDocument(<LabelledBox
			label={'Foobar'}
		/>);
		const labelNode = TestUtils.scryRenderedDOMComponentsWithTag(ploma, 'span')[0];
		expect(labelNode.textContent).to.equal('Foobar');
	});
});
