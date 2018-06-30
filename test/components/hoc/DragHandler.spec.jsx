// @flow
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';

import DragHandler, { type DragHandlerProps } from 'src/client/app/containers/Window/DragHandler';

const MockedSubComponent = () => <div />;

const MockedComponent = DragHandler(MockedSubComponent);

const defaultProps = () => ({
	onDragStart: stub(),
	onDrag: stub(),
	onDragEnd: stub(),
	cmdPressed: false,
});

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

	const renderComponentWithProps = (props: DragHandlerProps<{}>) => mount(
		<MockedComponent {...props}>
			<div
				width={400}
				height={400}
			/>
		</MockedComponent>);

	const renderComponent = () => renderComponentWithProps(defaultProps());

	describe('initializing', () => {
		it('sets mousePressed state', () => {
			const dragHandler = renderComponent();
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('disabled handling when cmd is pressed', () => {
			let dragStartCalled = false;
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
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
				...defaultProps(),
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
			const onDragStub = stub();
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
				onDrag: onDragStub,
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(onDragStub).to.have.been.called();
		});

		it('with touch calls the onDrag callback', () => {
			const onDragStub = stub();
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
				onDrag: onDragStub,
			});
			simulateTouchEventAtOn('touchStart', 10, 10, dragHandler);
			simulateTouchEventAtOn('touchMove', 10, 11, dragHandler);
			expect(onDragStub).to.have.been.called();
		});
	});

	describe('performing a hover action', () => {
		it('keeps the mousePressed state on false', () => {
			const dragHandler = renderComponent();
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(dragHandler.state('mousePressed')).to.be.false();
		});

		it('does not call the onDrag callback', () => {
			const onDragStub = stub();
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
				onDrag: onDragStub,
			});
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			expect(onDragStub).to.not.have.been.called();
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
			const onDragEndStub = stub();
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
				onDragEnd: onDragEndStub,
			});
			simulateMouseEventAtOn('mouseDown', 10, 10, dragHandler);
			simulateMouseEventAtOn('mouseMove', 10, 11, dragHandler);
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler);
			expect(onDragEndStub).to.have.been.called();
		});

		it('does not call the onDragEnd callback if mouse was not pressed', () => {
			const onDragEndStub = stub();
			const dragHandler = renderComponentWithProps({
				...defaultProps(),
				onDragEnd: onDragEndStub,
			});
			simulateMouseEventAtOn('mouseUp', 10, 12, dragHandler);
			expect(onDragEndStub).to.not.have.been.called();
		});
	});
});
