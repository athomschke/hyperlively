// @flow
import { expect } from 'chai';
import React from 'react';
import { last } from 'lodash';
import { shallow, mount } from 'enzyme';
import { stub, spy } from 'sinon';
import jsdom from 'jsdom-global';

import { ERROR_CALL_SUPER_TO_ABSTRACT, ERROR_DIRECT_ABSTRACT_CALL } from 'src/constants/errors';
import { point, exampleStrokes } from 'src/helpers.spec';

import AbstractSketch, { type AbstractSketchProps } from './AbstractSketch';

type SpecificProps = {
	overwriteFunctionCalled: () => void
}

class SpecificSketch extends AbstractSketch<AbstractSketchProps<SpecificProps>, {}> {
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
		width: 0,
		height: 0,
		showBorder: false,
		finished: false,
	}

	handleStrokesExtended(...args) {
		AbstractSketch.prototype.handleStrokesExtended.call(this, ...args);
	}

	handleStrokesEnded() { this.props.overwriteFunctionCalled(); }

	startStrokeAt() { this.props.overwriteFunctionCalled(); }

	extendStrokeAt() { this.props.overwriteFunctionCalled(); }

	endStrokeAt() { this.props.overwriteFunctionCalled(); }

	resetCanvas() { this.props.overwriteFunctionCalled(); }

	redrawStroke() { this.props.overwriteFunctionCalled(); }
}

const defaultProps = (): AbstractSketchProps<SpecificProps> => ({
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

const shallowWithProps = (props: AbstractSketchProps<SpecificProps>) => shallow(<SpecificSketch {...props} />);

const mountWithProps = (props: AbstractSketchProps<SpecificProps>) => mount(<SpecificSketch {...props} />);

describe('AbstractSketch', () => {
	let cleanup;
	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	describe('calling an abstract function directly', () => {
		it('throws an error for handleStrokeStarted when not implemented in subclass', () => {
			expect(SpecificSketch.prototype.handleStrokeStarted.bind(SpecificSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesExtended when implemented in subclass but calling the superclass', () => {
			const specificSketch = shallowWithProps(defaultProps());
			expect(specificSketch.instance().handleStrokesExtended.bind(specificSketch.instance()))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('cannot trigger an abstract method on Abstract Sketch implementation', () => {
			expect(AbstractSketch.prototype.handleAbstractMethodCalled.bind(AbstractSketch))
				.to.throw(ERROR_DIRECT_ABSTRACT_CALL);
		});

		it('throws an error for handleStrokeStarted', () => {
			expect(AbstractSketch.prototype.handleStrokeStarted.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesExtended', () => {
			expect(AbstractSketch.prototype.handleStrokesExtended.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for handleStrokesEnded', () => {
			expect(AbstractSketch.prototype.handleStrokesEnded.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for extendStrokeAt', () => {
			expect(AbstractSketch.prototype.extendStrokeAt.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for endStrokeAt', () => {
			expect(AbstractSketch.prototype.endStrokeAt.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for resetCanvas', () => {
			expect(AbstractSketch.prototype.resetCanvas.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('throws an error for redrawStroke', () => {
			expect(AbstractSketch.prototype.redrawStroke.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});

		it('does nothing for startStrokeAt', () => {
			expect(AbstractSketch.prototype.startStrokeAt.bind(AbstractSketch.prototype))
				.to.throw(ERROR_CALL_SUPER_TO_ABSTRACT);
		});
	});

	describe('changing a strokes color', () => {
		it('is recognized as an updated stroke', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificSketch = shallowWithProps({ ...defaultProps(), strokes });
			stub(specificSketch.instance(), 'handleStrokesUpdated');
			strokes[0].color = 'A new (invalid) Color';
			specificSketch.instance().componentDidUpdate();
			expect(specificSketch.instance().handleStrokesUpdated.callCount).to.equal(1);
			specificSketch.instance().handleStrokesUpdated.restore();
		});

		it('is not recognized as moved strokes', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificSketch = mountWithProps({ ...defaultProps(), strokes });
			stub(specificSketch.instance(), 'moveImageDataToNewPosition');
			strokes[0].color = 'A new (invalid) Color';
			specificSketch.instance().componentDidUpdate();
			expect(specificSketch.instance().moveImageDataToNewPosition.callCount).to.equal(0);
			specificSketch.instance().moveImageDataToNewPosition.restore();
		});

		it('redraws everything', () => {
			const strokes = exampleStrokes([point(10, 10)]);
			const specificSketch = mountWithProps({ ...defaultProps(), strokes });
			specificSketch.instance().redrawEverything = () => {};
			stub(specificSketch.instance(), 'redrawEverything');
			strokes[0].color = 'A new (invalid) Color';
			specificSketch.instance().componentDidUpdate();
			expect(specificSketch.instance().redrawEverything.callCount).to.equal(1);
			specificSketch.instance().redrawEverything.restore();
		});
	});

	describe('Rendering the component anew', () => {
		it('calls onNodeChanged with the new node', () => {
			const onNodeChanged = spy();
			const strokes = exampleStrokes([point(10, 10)]);
			const specificSketch = mountWithProps({ ...defaultProps(), strokes, onNodeChanged });
			onNodeChanged.reset();
			last(strokes).points.splice(-1);
			specificSketch.instance().componentDidUpdate();
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
			const wrapper = mount(<SpecificSketch
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
			const wrapper = shallow(<SpecificSketch
				bounds={bounds}
				strokes={strokes}
				overwriteFunctionCalled={() => undefined}
			/>);
			expect(wrapper.state('canvas')).to.be.null();
			expect(wrapper.instance().moveImageDataToNewPosition.bind(wrapper.instance())).not.to.throw();
		});
	});
});
