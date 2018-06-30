// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { last } from 'lodash';
import { shallow, mount } from 'enzyme';
import { stub } from 'sinon';

import { ERROR_CALL_SUPER_TO_ABSTRACT, ERROR_DIRECT_ABSTRACT_CALL } from 'src/client/app/constants/errors';
import { point, exampleStrokes } from 'src/client/app/helpers.spec';;

import AbstractDrawer, { type AbstractDrawerProps } from './AbstractDrawer';

type SpecificProps = {
	overwriteFunctionCalled: () => void
}

class SpecificDrawer extends AbstractDrawer<AbstractDrawerProps<SpecificProps>, {}> {
	static defaultProps = {
		overwriteFunctionCalled: () => undefined,
		strokes: [],
		bounds: {
			x: 0,
			y: 0,
			width: 2,
			height: 2,
		},
		active: false,
		width: window.innerWidth,
		height: window.innerHeight,
		showBorder: false,
		finished: false,
	}

	handleStrokesExtended(...args) {
		AbstractDrawer.prototype.handleStrokesExtended.call(this, ...args);
	}
	handleStrokesEnded() { this.props.overwriteFunctionCalled(); }
	startStrokeAt() { this.props.overwriteFunctionCalled(); }
	extendStrokeAt() { this.props.overwriteFunctionCalled(); }
	endStrokeAt() { this.props.overwriteFunctionCalled(); }
	resetCanvas() { this.props.overwriteFunctionCalled(); }
	redrawStroke() { this.props.overwriteFunctionCalled(); }
}

describe('AbstractDrawer', () => {
	let specificDrawer;
	let onNodeChangedStub;

	describe('calling an abstract function directly', () => {
		beforeEach(() => {
			onNodeChangedStub = stub();
			specificDrawer = TestUtils.renderIntoDocument(<SpecificDrawer
				strokes={exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)])}
				overwriteFunctionCalled={() => undefined}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				onNodeChanged={onNodeChangedStub}
				active={false}
				finished
			/>);
		});

		it('throws an error for handleStrokeStarted when not implemented in subclass', () => {
			expect(SpecificDrawer.prototype.handleStrokeStarted.bind(SpecificDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesExtended when implemented in subclass but calling the superclass', () => {
			expect(specificDrawer.handleStrokesExtended.bind(specificDrawer))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('cannot trigger an abstract method on Abstract Drawer implementation', () => {
			expect(AbstractDrawer.prototype.handleAbstractMethodCalled.bind(AbstractDrawer))
				.to.throw(ERROR_DIRECT_ABSTRACT_CALL);
		});

		it('throws an error for handleStrokeStarted', () => {
			expect(AbstractDrawer.prototype.handleStrokeStarted.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesExtended', () => {
			expect(AbstractDrawer.prototype.handleStrokesExtended.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesEnded', () => {
			expect(AbstractDrawer.prototype.handleStrokesEnded.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for extendStrokeAt', () => {
			expect(AbstractDrawer.prototype.extendStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for endStrokeAt', () => {
			expect(AbstractDrawer.prototype.endStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for resetCanvas', () => {
			expect(AbstractDrawer.prototype.resetCanvas.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for redrawStroke', () => {
			expect(AbstractDrawer.prototype.redrawStroke.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('does nothing for startStrokeAt', () => {
			expect(AbstractDrawer.prototype.startStrokeAt.bind(AbstractDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});
	});

	describe('changing a strokes color', () => {
		let strokes;

		const updatingColorShouldCallFunctionNTimes = (aFunction, n) => {
			stub(specificDrawer, aFunction);
			strokes[0].color = 'A new (invalid) Color';
			specificDrawer.componentDidUpdate();
			expect(specificDrawer[aFunction].callCount).to.equal(n);
			specificDrawer[aFunction].restore();
		};

		beforeEach(() => {
			onNodeChangedStub = stub();
			strokes = exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]);
			specificDrawer = TestUtils.renderIntoDocument(<SpecificDrawer
				overwriteFunctionCalled={() => {}}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0,
				}}
				strokes={strokes}
				onNodeChanged={onNodeChangedStub}
				active={false}
				finished
			/>);
		});

		it('is recognized as an updated stroke', () => {
			updatingColorShouldCallFunctionNTimes('handleStrokesUpdated', 1);
		});

		it('is not recognized as moved strokes', () => {
			updatingColorShouldCallFunctionNTimes('moveImageDataToNewPosition', 0);
		});

		it('redraws everything', () => {
			updatingColorShouldCallFunctionNTimes('redrawEverything', 1);
		});
	});

	describe('Rendering the component anew', () => {
		it('calls onNodeChanged with the new node', () => {
			const oldCount = onNodeChangedStub.callCount;
			last(specificDrawer.props.strokes).points.splice(-1);
			specificDrawer.componentDidUpdate();
			expect(onNodeChangedStub.callCount).to.be.above(oldCount);
		});
	});

	describe('Moving strokes', () => {
		let bounds;
		let strokes;

		beforeEach(() => {
			strokes = exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]);
			bounds = {
				width: 1000,
				height: 500,
				x: 0,
				y: 0,
			};
		});

		it('works without causing errors in rendering when canvas is not completely rendered', () => {
			const wrapper = mount(<SpecificDrawer
				bounds={bounds}
				strokes={strokes}
				overwriteFunctionCalled={() => undefined}
			/>);
			expect(wrapper.instance().state.canvas).to.exist();
			expect(wrapper.state('canvas')).to.not.be.null();
			stub(wrapper.state('canvas'), 'getContext');
			expect(wrapper.instance().moveImageDataToNewPosition.bind(wrapper.instance())).not.to.throw();
		});

		it('works without causing errors in rendering when canvas is not in DOM', () => {
			const wrapper = shallow(<SpecificDrawer
				bounds={bounds}
				strokes={strokes}
				overwriteFunctionCalled={() => undefined}
			/>);
			expect(wrapper.state('canvas')).to.be.null();
			expect(wrapper.instance().moveImageDataToNewPosition.bind(wrapper.instance())).not.to.throw();
		});
	});
});
