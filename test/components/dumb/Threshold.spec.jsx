import Threshold from 'components/dumb/Threshold';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Threshold slider', () => {

	it('displays threshold 10', () => {
		let component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		></Threshold>);
		expect(component.refs.slider.props.value).to.equal(10);
	});

	it('moving the handle does nothing per default', () => {
		let component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		></Threshold>);
		component.refs.slider.props.onChange(15);
		expect(component.refs.slider.props.value).to.equal(10);
	});
});