import TestUtils from 'react-addons-test-utils';
import Slider from 'rc-slider';
import React from 'react';

import Threshold from 'components/dumb/Threshold';

describe('Threshold slider', () => {
	it('displays threshold 10', () => {
		const component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		/>);
		const slider = TestUtils.scryRenderedComponentsWithType(component, Slider)[0];
		expect(slider.props.value).to.equal(10);
	});

	it('moving the handle does nothing per default', () => {
		const component = TestUtils.renderIntoDocument(<Threshold
			threshold={10}
		/>);
		const slider = TestUtils.scryRenderedComponentsWithType(component, Slider)[0];
		slider.props.onChange(15);
		expect(slider.props.value).to.equal(10);
	});
});
