import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { remove, filter, isNumber, map } from 'lodash';

import PlomaDrawer from 'src/client/app/components/smart/PlomaDrawer';

const renderComponentWithProps = props => TestUtils.renderIntoDocument(<PlomaDrawer
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
	sinon.spy(pen, 'beginStroke');
	sinon.spy(pen, 'extendStroke');
	sinon.spy(pen, 'endStroke');
	sinon.spy(pen, 'clear');
	sinon.spy(pen, 'setPenColor');
};

describe('PlomaDrawer', () => {
	let canvas;

	beforeEach(() => {
		canvas = renderComponentWithProps({
			strokes: [{
				points: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }],
			}],
		});
		canvas.componentDidUpdate();
	});

	describe('removing one point', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(1);
		});

		it('starts an existing stroke again', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});

		it('redraws all remaining strokes', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(3);
		});
	});

	describe('removing two points', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(1);
		});

		it('starts an existing stroke again', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});

		it('redraws all remaining strokes', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(2);
		});
	});

	describe('removing all but one point', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
		});

		it('keeps the canvas clean', () => {
			canvas.props.strokes[0].points.splice(-3);
			canvas.componentDidUpdate();
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(1);
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(0);
		});

		it('keeps a stroke selected', () => {
			canvas.props.strokes[0].selected = true;
			canvas.props.strokes[0].points.splice(-3);
			canvas.componentDidUpdate();
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(0);
		});
	});

	describe('removing all points in a stroke', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes[0].points.splice(-4);
			canvas.componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(1);
		});

		it('doesn\'t extend a stroke', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(0);
		});
	});

	describe('removing the second stroke', () => {
		beforeEach(() => {
			canvas.props.strokes[0].finished = true;
			canvas.props.strokes.push({ points: [{ x: 10, y: 15 }] });
			canvas.componentDidUpdate();
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes.splice(-1);
			canvas.componentDidUpdate();
		});

		it('clears the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(1);
		});

		it('starts the first stroke', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});

		it('extends the first stroke', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(3);
		});

		it('ends the first stroke', () => {
			expect(canvas.state.ballpointPen.endStroke.callCount).to.equal(1);
		});
	});

	describe('adding a point', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes[0].points.push({ x: 10, y: 15 });
			canvas.componentDidUpdate();
		});

		it('extends an existing stroke', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(1);
		});

		it('does not clear the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});
	});

	describe('ending a stroke', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes[0].finished = true;
			canvas.props.strokes[0].points.push({ x: 10, y: 14 });
			canvas.componentDidUpdate();
		});

		it('ends an existing stroke', () => {
			expect(canvas.state.ballpointPen.endStroke.callCount).to.equal(1);
		});

		it('does not clear the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});

		it('does not extend a stroke', () => {
			expect(canvas.state.ballpointPen.extendStroke.callCount).to.equal(0);
		});
	});

	describe('starting a new stroke', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes.push({ points: [{ x: 10, y: 15 }] });
			canvas.componentDidUpdate();
		});

		it('does not clear the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});

		it('begins a stroke', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});
	});

	describe('starting the first stroke', () => {
		beforeEach(() => {
			remove(canvas.props.strokes, canvas.props.strokes[0]);
			canvas.componentDidUpdate();
			spyOnPen(canvas.state.ballpointPen);
			canvas.props.strokes.push({
				points: [{ x: 10, y: 10 }],
			});
			canvas.componentDidUpdate();
		});

		it('does not clear the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});

		it('draws the beginning', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});

		it('with a colored pen chooses a different pen color', () => {
			const callCountBefore = canvas.state.ballpointPen.setPenColor.callCount;
			canvas.startStrokeAt({ x: 10, y: 10 }, { r: 45, g: 56, b: 67 });
			expect(canvas.state.ballpointPen.setPenColor.callCount - callCountBefore).to.equal(1);
		});

		it('with a colored pen needs to choose the right color format', () => {
			canvas.startStrokeAt({ x: 10, y: 10 }, { r: 45, g: 56, b: 67 });
			const wrongFormats = filter(canvas.state.ballpointPen.setPenColor.args, arg =>
					!(isNumber(arg[0].r) && isNumber(arg[0].g) && isNumber(arg[0].b)));
			expect(wrongFormats).to.have.length(0);
		});

		it('is done when redrawing a single point stroke', () => {
			canvas.resetCanvas();
			canvas.componentDidUpdate();
			canvas.props.strokes.push({ points: [{ x: 10, y: 10 }] });
			canvas.componentDidUpdate();
			expect(true).to.be.true();
		});
	});

	describe.skip('changing the position of displayed points', () => {
		beforeEach(() => {
			spyOnPen(canvas.state.ballpointPen);
			const firstStroke = canvas.props.strokes[0];
			firstStroke.points = map(firstStroke.points, point =>
					Object.assign({}, point, { x: point.x + 10 }));
			canvas.componentDidUpdate();
		});

		it('Does not trigger a complete rerendering', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});
	});

	describe('selecting strokes', () => {
		beforeEach(() => {
			const firstStroke = canvas.props.strokes[0];
			firstStroke.points = map(firstStroke.points, point =>
					Object.assign({}, point, { x: point.x + 10 }));
			canvas.componentDidUpdate();
		});

		it('Gives them a different color than normally', () => {
			canvas.props.strokes.push({ points: [{ x: 30, y: 30 }, { x: 31, y: 31 }, { x: 32, y: 32 }] });
			canvas.componentDidUpdate();
			canvas.props.strokes[1].selected = true;
			spyOnPen(canvas.state.ballpointPen);
			canvas.componentDidUpdate();
			expect(canvas.state.ballpointPen.setPenColor.callCount).to.equal(2);
			const firstCalledArg = canvas.state.ballpointPen.setPenColor.args[0][0];
			const secondCalledArg = canvas.state.ballpointPen.setPenColor.args[1][0];
			expect(firstCalledArg).to.not.deep.equal(secondCalledArg);
		});
	});
});
