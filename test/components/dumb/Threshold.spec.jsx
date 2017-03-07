import Threshold from 'components/dumb/Threshold';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

describe('Threshold slider', () => {
	it('displays threshold 10', () => {
		const component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		/>);
		expect(component.refs.slider.props.value).to.equal(10);
	});

	it('moving the handle does nothing per default', () => {
		const component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		/>);
		component.refs.slider.props.onChange(15);
		expect(component.refs.slider.props.value).to.equal(10);
	});
});
