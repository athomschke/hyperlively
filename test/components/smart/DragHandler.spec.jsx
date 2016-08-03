import TestUtils from 'react-addons-test-utils';
import React from 'react';
import DragHandler from 'components/smart/DragHandler';

class MockedSubComponent extends React.Component {

	render () {
		return <div></div>;
	}
}

const MockedComponent = DragHandler(MockedSubComponent);

describe('Drag handler', () => {

	let simulateMouseEventAtOn = (eventType, x, y, node) => {
		TestUtils.Simulate[eventType](node, {
			pageX: x,
			pageY: y
		});
	}

	let renderComponentWithCallbacks = (props) => {
		return TestUtils.renderIntoDocument(
			<MockedComponent {...props}>
				<div
					width={400}
					height={400}
				/>
			</MockedComponent>
		);
	}

	let renderComponent = () => {
		return renderComponentWithCallbacks({})
	}

	describe('initializing', () => {

		it('sets mousePressed state', () => {
			let dragHandler = renderComponent();
			expect(dragHandler.state.mousePressed).to.be.false;
		})

	})

	describe('pressing mouse down', () => {

		it('sets the mousePressed state to true', () => {
			let dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			expect(dragHandler.state.mousePressed).to.be.true;
		})

		it('calls the onDragStart callback', () => {
			let dragStartCalled = false;
			let dragHandler = renderComponentWithCallbacks({
				onDragStart: function () {dragStartCalled = true }
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			expect(dragStartCalled).to.be.true;
		})

	})

	describe('performing a drag action', () => {

		it('keeps the mousePressed state on true', () => {
			let dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			expect(dragHandler.state.mousePressed).to.be.true;
		})

		it('calls the onDrag callback', () => {
			let dragCalled = false;
			let dragHandler = renderComponentWithCallbacks({
				onDrag: () => { dragCalled = true }
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			expect(dragCalled).to.be.true;
		})

	})

	describe('performing a hover action', () => {

		it('keeps the mousePressed state on false', () => {
			let dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			expect(dragHandler.state.mousePressed).to.be.false;
		})

		it('does not call the onDrag callback', () => {
			let dragCalled = false;
			let dragHandler = renderComponentWithCallbacks({
				onDrag: () => { dragCalled = true }
			});
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			expect(dragCalled).to.be.false;
		})

	})

	describe('releasing the mouse', () => {

		it('sets the mousePressed state to false', () => {
			let dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler.refs.node);
			expect(dragHandler.state.mousePressed).to.be.false;
		})

		it('calls the onDragEnd callback if mouse was pressed', () => {
			let dragEndCalled = false;
			let dragHandler = renderComponentWithCallbacks({
				onDragEnd: () => { dragEndCalled = true }
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler.refs.node);
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler.refs.node);
			expect(dragEndCalled).to.be.true;
		})

		it('does not call the onDragEnd callback if mouse was not pressed', () => {
			let dragEndCalled = false;
			let dragHandler = renderComponentWithCallbacks({
				onDragEnd: () => { dragEndCalled = true }
			});
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler.refs.node);
			expect(dragEndCalled).to.be.false;
		})

	})

})