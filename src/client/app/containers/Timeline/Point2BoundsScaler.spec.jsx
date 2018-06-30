// @flow
import { expect } from 'chai';
import { stub } from 'sinon';
import * as React from 'react';
import TestUtils from 'react-addons-test-utils';

import Point2BoundsScaler, { type Point2BoundsScalerProps, type WrappedProps } from './Point2BoundsScaler';

describe('Point2BoundsScaler', () => {
	let Wrapped: (props: WrappedProps<{}>) => void;

	beforeEach(() => {
		Wrapped = stub();
		Wrapped.returns(<div />);
		const WrappedWithPoint2BoundsScaler: React.ComponentType<Point2BoundsScalerProps<{}>> =
		Point2BoundsScaler(Wrapped);
		TestUtils.renderIntoDocument(<WrappedWithPoint2BoundsScaler
			strokes={[]}
			htmlWidth={100}
			previewHeight={150}
			max={2}
		/>);
	});

	describe('using the scaler to render', () => {
		it('shows a border around the wrapped component', () => {
			expect(Wrapped.args[0][0].showBorder).to.be.true();
		});

		it('sets wrapped component to finished', () => {
			expect(Wrapped.args[0][0].finished).to.be.true();
		});
	});
});
