import React from 'react';
import { mount } from 'enzyme';

import DragHandler from 'src/client/app/components/hoc/DragHandler';

const MockedSubComponent = () => <div />;

const MockedComponent = DragHandler(MockedSubComponent);

describe('Drag handler', () => {
	const simulateMouseEventAtOn = (eventType, x, y, node) => {
		node.simulate(eventType, {
			pageX: x,
			pageY: y,
		});
	};

	const simulateTouchEventAtOn = (eventType, x, y, node) => {
		node.simulate(eventType, {
			changedTouches: [{
				pageX: x,
				pageY: y,
			}],
		});
	};

	const renderComponentWithProps = props => mount(
		<MockedComponent {...props}>
			<div
				width={400}
				height={400}
			/>
		</MockedComponent>);

	const renderComponent = () => renderComponentWithProps({});

	describe('initializing', () => {
		it('sets mousePressed state', () => {
			const dragHandler = renderComponent();
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('disabled handling when cmd is pressed', () => {
			let dragStartCalled = false;
			const dragHandler = renderComponentWithProps({
				onDragStart: () => { dragStartCalled = true; },
				cmdPressed: true,
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			expect(dragStartCalled).to.be.false();
		});
	});

	describe('pressing mouse down', () => {
		it('sets the mousePressed state to true', () => {
			const dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.true();
		});

		it('calls the onDragStart callback', () => {
			let dragStartCalled = false;
			const dragHandler = renderComponentWithProps({
				onDragStart: () => { dragStartCalled = true; },
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			expect(dragStartCalled).to.be.true();
		});
	});

	describe('performing a drag action', () => {
		it('keeps the mousePressed state on true', () => {
			const dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.true();
		});

		it('calls the onDrag callback', () => {
			let dragCalled = false;
			const dragHandler = renderComponentWithProps({
				onDrag: () => { dragCalled = true; },
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(dragCalled).to.be.true();
		});

		it('with touch calls the onDrag callback', () => {
			let dragCalled = false;
			const dragHandler = renderComponentWithProps({
				onDrag: () => { dragCalled = true; },
			});
			simulateTouchEventAtOn('touchStart', 10, 10, dragHandler);
			simulateTouchEventAtOn('touchMove', 10, 11, dragHandler);
			expect(dragCalled).to.be.true();
		});
	});

	describe('performing a hover action', () => {
		it('keeps the mousePressed state on false', () => {
			const dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('does not call the onDrag callback', () => {
			let dragCalled = false;
			const dragHandler = renderComponentWithProps({
				onDrag: () => { dragCalled = true; },
			});
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(dragCalled).to.be.false();
		});
	});

	describe('releasing', () => {
		it('sets the mousePressed state to false', () => {
			const dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('a finger sets the mousePressed state to false', () => {
			const dragHandler = renderComponent();
			simulateTouchEventAtOn('touchStart', 10, 10, dragHandler);
			simulateTouchEventAtOn('touchMove', 10, 11, dragHandler);
			simulateTouchEventAtOn('touchEnd', 10, 12, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('calls the onDragEnd callback if mouse was pressed', () => {
			let dragEndCalled = false;
			const dragHandler = renderComponentWithProps({
				onDragEnd: () => { dragEndCalled = true; },
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler);
			expect(dragEndCalled).to.be.true();
		});

		it('does not call the onDragEnd callback if mouse was not pressed', () => {
			let dragEndCalled = false;
			const dragHandler = renderComponentWithProps({
				onDragEnd: () => { dragEndCalled = true; },
			});
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler);
			expect(dragEndCalled).to.be.false();
		});
	});
});
