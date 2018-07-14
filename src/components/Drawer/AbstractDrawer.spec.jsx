// @flow
import { expect } from 'chai';
import React from 'react';
import { last } from 'lodash';
import { shallow, mount } from 'enzyme';
import { stub, spy } from 'sinon';

import { ERROR_CALL_SUPER_TO_ABSTRACT, ERROR_DIRECT_ABSTRACT_CALL } from 'src/constants/errors';
import { point, exampleStrokes } from 'src/helpers.spec';

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

const defaultProps = (): AbstractDrawerProps<SpecificProps> => ({
	strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)]),
	overwriteFunctionCalled: () => undefined,
	bounds: {
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	},
	height: 0,
	width: 0,
	showBorder: false,
	onNodeChanged: () => {},
	active: false,
	finished: true,
});

const shallowWithProps = (props: AbstractDrawerProps<SpecificProps>) => shallow(<SpecificDrawer {...props} />);

const mountWithProps = (props: AbstractDrawerProps<SpecificProps>) => mount(<SpecificDrawer {...props} />);

describe('AbstractDrawer', () => {
	describe('calling an abstract function directly', () => {
		it('throws an error for handleStrokeStarted when not implemented in subclass', () => {
			expect(SpecificDrawer.prototype.handleStrokeStarted.bind(SpecificDrawer.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesExtended when implemented in subclass but calling the superclass', () => {
			const specificDrawer = shallowWithProps(defaultProps());
			expect(specificDrawer.instance().handleStrokesExtended.bind(specificDrawer.instance()))
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
		it('is recognized as an updated stroke', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificDrawer = shallowWithProps({ ...defaultProps(), strokes });
			stub(specificDrawer.instance(), 'handleStrokesUpdated');
			strokes[0].color = 'A new (invalid) Color';
			specificDrawer.instance().componentDidUpdate();
			expect(specificDrawer.instance().handleStrokesUpdated.callCount).to.equal(1);
			specificDrawer.instance().handleStrokesUpdated.restore();
		});

		it('is not recognized as moved strokes', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificDrawer = mountWithProps({ ...defaultProps(), strokes });
			stub(specificDrawer.instance(), 'moveImageDataToNewPosition');
			strokes[0].color = 'A new (invalid) Color';
			specificDrawer.instance().componentDidUpdate();
			expect(specificDrawer.instance().moveImageDataToNewPosition.callCount).to.equal(0);
			specificDrawer.instance().moveImageDataToNewPosition.restore();
		});

		it('redraws everything', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificDrawer = mountWithProps({ ...defaultProps(), strokes });
			specificDrawer.instance().redrawEverything = () => {};
			stub(specificDrawer.instance(), 'redrawEverything');
			strokes[0].color = 'A new (invalid) Color';
			specificDrawer.instance().componentDidUpdate();
			expect(specificDrawer.instance().redrawEverything.callCount).to.equal(1);
			specificDrawer.instance().redrawEverything.restore();
		});
	});

	describe('Rendering the component anew', () => {
		it('calls onNodeChanged with the new node', () => {
			const onNodeChanged = spy();
			const strokes = exampleStrokes([point(10, 10)]);
			const specificDrawer = mountWithProps({ ...defaultProps(), strokes, onNodeChanged });
			onNodeChanged.reset();
			last(strokes).points.splice(-1);
			specificDrawer.instance().componentDidUpdate();
			expect(onNodeChanged.callCount).to.equal(2);
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
