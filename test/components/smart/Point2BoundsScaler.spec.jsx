import Point2BoundsScaler from 'components/smart/Point2BoundsScaler';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';

class Wrapped extends Component {
	render() {
		return (<div/>);
	}
}

let WrappedWithPoint2BoundsScaler = Point2BoundsScaler(Wrapped);

describe('Point2BoundsScaler', () => {
	describe('using the scaler to render', () => {
		it('shows a border around the wrapped component', () => {
			let component = TestUtils.renderIntoDocument(<WrappedWithPoint2BoundsScaler />);
			expect(component.refs.point2BoundsScaled.props.showBorder).to.true;
		});
		it('sets wrapped component to finished', () => {
			let component = TestUtils.renderIntoDocument(<WrappedWithPoint2BoundsScaler />);
			expect(component.refs.point2BoundsScaled.props.finished).to.true;
		});
	});
});
