import PlomaDrawer from 'components/smart/PlomaDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { remove, forEach } from 'lodash';

'use strict';

let renderComponentWithProps = (props) => {
	return TestUtils.renderIntoDocument(<PlomaDrawer
		bounds={{
			width: 1000,
			height: 500,
			x: 0,
			y: 0
		}}
		uniqueCanvasFactor={props.uniqueCanvasFactor || Math.random()}
		strokes={props.strokes || []}
	/>);
};

let spyOnPen = (pen) => {
	sinon.spy(pen, 'beginStroke');
	sinon.spy(pen, 'extendStroke');
	sinon.spy(pen, 'endStroke');
	sinon.spy(pen, 'clear');
};

let resetPenSpies = (pen) => {
	pen.beginStroke.reset();
	pen.extendStroke.reset();
	pen.endStroke.reset();
	pen.clear.reset();
};

let restorePen = (pen) => {
	pen.beginStroke.restore();
	pen.extendStroke.restore();
	pen.endStroke.restore();
	pen.clear.restore();
};

describe('PlomaDrawer', () => {

	let canvas;

	beforeEach(() => {
		canvas = renderComponentWithProps({ strokes: [] });
		spyOnPen(canvas.state.ballpointPen);
		canvas.props.strokes.push({ points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}] });
		canvas.componentDidUpdate();
		resetPenSpies(canvas.state.ballpointPen);
	});

	afterEach(() => {
		restorePen(canvas.state.ballpointPen);
	});

	describe('removing one point', () => {

		beforeEach(() => {
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

	describe('adding a point', () => {

		beforeEach(() => {
			canvas.props.strokes[0].points.push({x: 10, y: 15});
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
			canvas.props.strokes[0].finished = true;
			canvas.props.strokes[0].points.push({x: 10, y: 14});
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
			canvas.props.strokes.push({ points: [{x: 10, y: 15}] });
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
			resetPenSpies(canvas.state.ballpointPen);
			canvas.props.strokes.push({
				points: [{ x: 10, y: 10 }]
			});
			canvas.componentDidUpdate();
		});

		it('does not clear the canvas', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});

		it('draws the beginning', () => {
			expect(canvas.state.ballpointPen.beginStroke.callCount).to.equal(1);
		});
	});

	describe('changing the position of displayed points', () => {

		beforeEach(() => {
			forEach(canvas.props.strokes[0].points, (point) => { point.x += 10; });
			canvas.componentDidUpdate();
		});

		it('Does not trigger a complete rerendering', () => {
			expect(canvas.state.ballpointPen.clear.callCount).to.equal(0);
		});

	});

});