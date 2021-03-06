// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import {
	remove, filter, isNumber, map,
} from 'lodash';
import { spy } from 'sinon';

import { point, exampleStrokes } from 'src/helpers.spec';

import mockCanvas, { defaultContext } from './mockCanvas';
import PlomaSketch, { type PlomaSketchProps } from './PlomaSketch';
import { type AbstractSketchProps } from './AbstractSketch';

type Props = AbstractSketchProps<PlomaSketchProps>

const mountComponentWithProps = (props: Props) => mount(<PlomaSketch
	bounds={{
		width: 1000,
		height: 500,
		x: 0,
		y: 0,
	}}
	uniqueCanvasFactor={props.uniqueCanvasFactor || Math.random()}
	strokes={props.strokes || []}
/>);

const spyOnPen = (pen) => {
	spy(pen, 'beginStroke');
	spy(pen, 'extendStroke');
	spy(pen, 'endStroke');
	spy(pen, 'clear');
	spy(pen, 'setPenColor');
};

const defaultProps = () => ({
	strokes: exampleStrokes([point(10, 10), point(10, 11), point(10, 12), point(10, 13)], false),
	uniqueCanvasFactor: 1,
	bounds: {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	},
	active: false,
	width: 100,
	height: 100,
	showBorder: true,
	finished: true,
});

describe('PlomaSketch', () => {
	let canvas;
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
		mockCanvas(defaultContext());
	});

	afterEach(() => {
		cleanup();
	});

	describe('removing one point', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes')[0].points.splice(-1);
			canvas.instance().componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(1);
		});

		it('starts an existing stroke again', () => {
			expect(canvas.state('ballpointPen').beginStroke.callCount).to.equal(1);
		});

		it('redraws all remaining strokes', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(3);
		});
	});

	describe('removing two points', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes')[0].points.splice(-2);
			canvas.instance().componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(1);
		});

		it('starts an existing stroke again', () => {
			expect(canvas.state('ballpointPen').beginStroke.callCount).to.equal(1);
		});

		it('redraws all remaining strokes', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(2);
		});
	});

	describe('removing all but one point', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
		});

		it('keeps the canvas clean', () => {
			canvas.prop('strokes')[0].points.splice(-3);
			canvas.instance().componentDidUpdate();
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(1);
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(0);
		});

		it('keeps a stroke selected', () => {
			canvas.prop('strokes')[0].selected = true;
			canvas.prop('strokes')[0].points.splice(-3);
			canvas.instance().componentDidUpdate();
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(0);
		});
	});

	describe('removing all points in a stroke', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes')[0].points.splice(-4);
			canvas.instance().componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(1);
		});

		it('doesn\'t extend a stroke', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(0);
		});
	});

	describe('removing the second stroke', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			canvas.prop('strokes')[0].finished = true;
			canvas.prop('strokes').push(exampleStrokes([point(10, 15)])[0]);
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes').splice(-1);
			canvas.instance().componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(1);
		});

		it('starts the first stroke', () => {
			expect(canvas.state('ballpointPen').beginStroke.callCount).to.equal(1);
		});

		it('extends the first stroke', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(3);
		});

		it('ends the first stroke', () => {
			expect(canvas.state('ballpointPen').endStroke.callCount).to.equal(1);
		});
	});

	describe('adding a point', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes')[0].points.push({ x: 10, y: 15 });
			canvas.instance().componentDidUpdate();
		});

		it('extends an existing stroke', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(1);
		});

		it('does not clear the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(0);
		});
	});

	describe('ending a stroke', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes')[0].finished = true;
			canvas.prop('strokes')[0].points.push({ x: 10, y: 14 });
			canvas.instance().componentDidUpdate();
		});

		it('ends an existing stroke', () => {
			expect(canvas.state('ballpointPen').endStroke.callCount).to.equal(1);
		});

		it('does not clear the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(0);
		});

		it('does not extend a stroke', () => {
			expect(canvas.state('ballpointPen').extendStroke.callCount).to.equal(0);
		});
	});

	describe('starting a new stroke', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes').push({ points: [{ x: 10, y: 15 }] });
			canvas.instance().componentDidUpdate();
		});

		it('does not clear the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(0);
		});

		it('begins a stroke', () => {
			expect(canvas.state('ballpointPen').beginStroke.callCount).to.equal(1);
		});
	});

	describe('starting the first stroke', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			remove(canvas.prop('strokes'), canvas.prop('strokes')[0]);
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			canvas.prop('strokes').push({
				points: [{ x: 10, y: 10 }],
			});
			canvas.instance().componentDidUpdate();
		});

		it('does not clear the canvas', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(0);
		});

		it('draws the beginning', () => {
			expect(canvas.state('ballpointPen').beginStroke.callCount).to.equal(1);
		});

		it('with a colored pen chooses a different pen color', () => {
			const callCountBefore = canvas.state('ballpointPen').setPenColor.callCount;
			canvas.instance().startStrokeAt({ x: 10, y: 10 }, { r: 45, g: 56, b: 67 });
			expect(canvas.state('ballpointPen').setPenColor.callCount - callCountBefore).to.equal(1);
		});

		it('with a colored pen needs to choose the right color format', () => {
			canvas.instance().startStrokeAt({ x: 10, y: 10 }, { r: 45, g: 56, b: 67 });
			const wrongFormats = filter(canvas.state('ballpointPen').setPenColor.args, arg => !(isNumber(arg[0].r) && isNumber(arg[0].g) && isNumber(arg[0].b)));
			expect(wrongFormats).to.have.length(0);
		});

		it('is done when redrawing a single point stroke', () => {
			canvas.instance().resetCanvas();
			canvas.instance().componentDidUpdate();
			canvas.prop('strokes').push({ points: [{ x: 10, y: 10 }] });
			canvas.instance().componentDidUpdate();
			expect(true).to.be.true();
		});
	});

	describe.skip('changing the position of displayed points', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			spyOnPen(canvas.state('ballpointPen'));
			const firstStroke = canvas.prop('strokes')[0];
			firstStroke.points = map(firstStroke.points, aPoint => Object.assign({}, aPoint, { x: aPoint.x + 10 }));
			canvas.instance().componentDidUpdate();
		});

		it('Does not trigger a complete rerendering', () => {
			expect(canvas.state('ballpointPen').clear.callCount).to.equal(0);
		});
	});

	describe('selecting strokes', () => {
		beforeEach(() => {
			canvas = mountComponentWithProps(defaultProps());
			canvas.instance().componentDidUpdate();
			const firstStroke = canvas.prop('strokes')[0];
			firstStroke.points = map(firstStroke.points, aPoint => Object.assign({}, aPoint, { x: aPoint.x + 10 }));
			canvas.instance().componentDidUpdate();
		});

		it('Gives them a different color than normally', () => {
			const aStroke = exampleStrokes([point(30, 30), point(31, 31), point(32, 32)])[0];
			canvas.prop('strokes').push(aStroke);
			canvas.instance().componentDidUpdate();
			canvas.prop('strokes')[1].selected = true;
			spyOnPen(canvas.state('ballpointPen'));
			canvas.instance().componentDidUpdate();
			expect(canvas.state('ballpointPen').setPenColor.callCount).to.equal(2);
			const firstCalledArg = canvas.state('ballpointPen').setPenColor.args[0][0];
			const secondCalledArg = canvas.state('ballpointPen').setPenColor.args[1][0];
			expect(firstCalledArg).to.not.deep.equal(secondCalledArg);
		});
	});
});
