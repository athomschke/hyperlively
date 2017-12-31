import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Point2BoundsScaler from 'src/client/app/components/hoc/Point2BoundsScaler';

let calledWithProps;

const Wrapped = (props) => {
	calledWithProps = props;
	return <div />;
};

const WrappedWithPoint2BoundsScaler = Point2BoundsScaler(Wrapped);

describe('Point2BoundsScaler', () => {
	describe('using the scaler to render', () => {
		beforeEach(() => {
			calledWithProps = null;
		});

		it('shows a border around the wrapped component', () => {
			TestUtils.renderIntoDocument(<WrappedWithPoint2BoundsScaler />);
			expect(calledWithProps.showBorder).to.be.true();
		});

		it('sets wrapped component to finished', () => {
			TestUtils.renderIntoDocument(<WrappedWithPoint2BoundsScaler />);
			expect(calledWithProps.finished).to.be.true();
		});
	});
});
