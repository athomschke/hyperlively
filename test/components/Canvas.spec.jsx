import Canvas from 'components/Canvas';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import push from 'lodash';

let simulateDrawingEventOnCanvasAt = (eventType, canvas, x, y) => {
	TestUtils.Simulate[eventType](canvas.refs.canvas, {
		pageX: x,
		pageY: y
	});
}

let startStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseDown', canvas, x, y);
}

let extendStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseMove', canvas, x, y);
}

let endStrokeAt = (canvas, x, y) => {
	simulateDrawingEventOnCanvasAt('mouseUp', canvas, x, y);
}

describe('Canvas', () => {

	let canvas;

	describe('drawing', () => {

		beforeEach(() => {
			canvas = TestUtils.renderIntoDocument(<Canvas></Canvas>);
		})

		it('is inactive when initializing', () => {
			expect(canvas.state.isDrawing).to.be.false;
		})

		it('starts on mouse down', () => {
			startStrokeAt(canvas, 10, 10);
			expect(canvas.state.isDrawing).to.be.true;
		})

		it('continues when moving pressed mouse', () => {
			startStrokeAt(canvas, 10, 10);
			expect(canvas.state.isDrawing).to.be.true;
			extendStrokeAt(canvas, 10, 11);
			expect(canvas.state.isDrawing).to.be.true;
		})

		it('stops when releasing mouse', () => {
			startStrokeAt(canvas, 10, 10);
			expect(canvas.state.isDrawing).to.be.true;
			extendStrokeAt(canvas, 10, 11);
			expect(canvas.state.isDrawing).to.be.true;
			endStrokeAt(canvas, 10, 11);
			expect(canvas.state.isDrawing).to.be.false;
		})

	})

	describe('plain rendered image', () => {

		beforeEach(() => {
			canvas = TestUtils.renderIntoDocument(<Canvas
				usePloma={false}
				strokes={[{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}]
				}]}
			></Canvas>);
		})

		it('is updated when a point is added', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			push(canvas.props.strokes[0].points, {x: 10, y: 13});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(imageDataBefore).to.not.equal(imageDataAfter);
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(imageDataBefore).to.not.equal(imageDataAfter);
		})

	})

	describe('ploma rendered image', () => {

		beforeEach(() => {
			canvas = TestUtils.renderIntoDocument(<Canvas
				usePloma={true}
				strokes={[{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}]
				}]}
			></Canvas>);
		})

		it('is updated when a point is added', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			push(canvas.props.strokes[0].points, {x: 10, y: 13});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(imageDataBefore).to.not.equal(imageDataAfter);
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(imageDataBefore).to.not.equal(imageDataAfter);
		})

	})

})