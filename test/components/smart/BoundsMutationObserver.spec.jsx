import TestUtils from 'react-addons-test-utils';
import React from 'react';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';

class MockedSubComponent extends React.Component {

	render () {
		return <div ref='node'></div>;
	}
}

const MockedComponent = BoundsMutationObserver(MockedSubComponent);

describe('Bounds mutation observer', () => {

	describe('changing a style property', () => {

		it('calls the callback with a position if one is given', (done) => {
			let called = false;
			let mockedComponent = TestUtils.renderIntoDocument(<MockedComponent
				onBoundsUpdate={() => {
						called = true;
					}}
				bounds={{
					x: 1,
					y: 0
				}}
			/>)
			mockedComponent.refs.wrapped.refs.node.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(called).to.be.true
				done();
			})
		})

		it('changes nothing if no callback is given', (done) => {
			let bounds = {
					x: 1,
					y: 0
				}
			let mockedComponent = TestUtils.renderIntoDocument(<MockedComponent
				bounds={bounds}
			/>)
			mockedComponent.refs.wrapped.refs.node.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.props.bounds.x).to.equal(bounds.x)
				expect(mockedComponent.props.bounds.y).to.equal(bounds.y)
				done();
			})
		})

	})

})