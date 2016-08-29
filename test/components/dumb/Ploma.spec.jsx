import Ploma from 'components/dumb/Ploma';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Ploma', () => {

	it('toggling without a callback does not change the checked state', () => {
		let ploma = TestUtils.renderIntoDocument(<Ploma></Ploma>);
		let previousValue = ploma.props.checked;
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
		expect(ploma.props.checked).to.equal(previousValue);
	});

	it('calls callback with true when not checked and clicked', () => {
		let value = false;
		let ploma = TestUtils.renderIntoDocument(<Ploma
			checked={false}
			onChange={(bool) => {
				value=bool;
			}}
		></Ploma>);
		TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(ploma, 'input'));
		expect(value).to.be.true;
	});

	it('displays the label', () => {
		let ploma = TestUtils.renderIntoDocument(<Ploma
			label={'Foobar'}
		></Ploma>);
		let labelNode = TestUtils.scryRenderedDOMComponentsWithTag(ploma, 'span')[0];
		expect(labelNode.textContent).to.equal('Foobar');
	});
});