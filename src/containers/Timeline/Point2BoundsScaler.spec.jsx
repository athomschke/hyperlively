// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as React from 'react';

import Point2BoundsScaler, { type Point2BoundsScalerProps } from './Point2BoundsScaler';

const Wrapped = () => <div />;
const WrappedWithPoint2BoundsScaler = Point2BoundsScaler(Wrapped);

const defaultProps = () => ({
	strokes: [],
	htmlWidth: 100,
	previewHeight: 150,
	max: 2,
});

const renderWithProps = (props: Point2BoundsScalerProps<{}>) =>
	shallow(<WrappedWithPoint2BoundsScaler {...props} />);

describe('Point2BoundsScaler', () => {
	describe('using the scaler to render', () => {
		it('shows a border around the wrapped component', () => {
			const component = renderWithProps(defaultProps());
			expect(component.find(Wrapped)).to.have.length(1);
		});

		it('sets wrapped component to finished', () => {
			const component = renderWithProps(defaultProps());
			expect(component.find(Wrapped).prop('finished')).to.be.true();
		});
	});
});
