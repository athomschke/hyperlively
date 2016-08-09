import TestUtils from 'react-addons-test-utils';
import React from 'react';
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver';

class MockedSubComponent extends React.Component {

	render () {
		return <div ref='node'
			style={{
				top: this.props.bounds.y,
				left: this.props.bounds.x
			}}
		></div>;
	}
}

const MockedComponent = BoundsMutationObserver(MockedSubComponent);

let renderComponentWithBoundsAndCallback = (bounds, callback) => {
	return TestUtils.renderIntoDocument(<MockedComponent
		onBoundsUpdate={callback}
		bounds={bounds}
	/>);
};

describe('Bounds mutation observer', () => {

	describe('moving the wrapped component', () => {

		it('horizontally calls the callback with a position when one is given', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 1, y: 0 }, 
				() => { called = true; });
			mockedComponent.refs.wrapped.refs.node.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(called).to.be.true;
				done();
			});
		});

		it('vertically calls the callback with a position when one is given', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 0, y: 1 },
				() => { called = true; });
			mockedComponent.refs.wrapped.refs.node.style.setProperty('top', '2px');
			setTimeout(() => {
				expect(called).to.be.true;
				done();
			});
		});

		it('changes nothing if no callback is given', (done) => {
			let bounds = { x: 1, y: 0 };
			let mockedComponent = renderComponentWithBoundsAndCallback(bounds);
			mockedComponent.refs.wrapped.refs.node.style.setProperty('left', '2px');
			setTimeout(() => {
				expect(mockedComponent.props.bounds.x).to.equal(bounds.x);
				expect(mockedComponent.props.bounds.y).to.equal(bounds.y);
				done();
			});
		});

		it('is not recognized when component is not in dom anymore', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 1, y: 0 }, 
				() => { called = true; });
			let node = mockedComponent.refs.wrapped.refs.node;
			mockedComponent.componentWillUnmount();
			node.style.setProperty('top', '2px');
			setTimeout(() => {
				expect(called).to.be.false;
				done();
			});
		});

		it('is not recognized when component is not really moved', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 0, y: 0 },
				() => { called = true; });
			let node = mockedComponent.refs.wrapped.refs.node;
			mockedComponent.componentWillUnmount();
			node.style.setProperty('top', '0px');
			setTimeout(() => {
				expect(called).to.be.false;
				done();
			});
		});

	});

	describe('setting width of a wrapped component', () => {
		it('triggers no callback', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 1, y: 0 }, 
				() => { called = true; });
			mockedComponent.refs.wrapped.refs.node.setAttribute('width', '100px');
			setTimeout(() => {
				expect(called).to.be.false;
				done();
			});
		});
	});

	describe('setting border style of wrapped component', () => {
		it('triggers no callback', (done) => {
			let called = false;
			let mockedComponent = renderComponentWithBoundsAndCallback(
				{ x: 1, y: 0 }, 
				() => { called = true; });
			mockedComponent.refs.wrapped.refs.node.style.setProperty('border-style', 'solid');
			setTimeout(() => {
				expect(called).to.be.false;
				done();
			});
		});
	});

});