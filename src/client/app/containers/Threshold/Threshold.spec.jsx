// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import Slider from 'rc-slider';
import React from 'react';

import Threshold, { type ThresholdProps } from './Threshold';

const renderWithProps = (props: ThresholdProps) => shallow(<Threshold {...props} />);

describe('Threshold slider', () => {
	it('displays threshold 10', () => {
		const threshold = 10;
		const component = renderWithProps({ threshold, onChange: () => {} });
		const slider = component.find(Slider);
		expect(slider.prop('value')).to.equal(10);
	});

	it('moving the handle calls onChange', () => {
		const onChange = spy();
		const component = renderWithProps({ threshold: 10, onChange });
		const slider = component.find(Slider);
		slider.prop('onChange')(15);
		expect(onChange.callCount).to.equal(1);
	});
});
