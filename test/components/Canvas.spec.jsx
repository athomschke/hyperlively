import Canvas from 'components/Canvas';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { hashCode } from '../helpers';

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

let renderPlomaCanvasWithStrokes = (strokes) => {
	return TestUtils.renderIntoDocument(<Canvas
		usePloma={true}
		strokes={strokes}
	></Canvas>);
}

'use strict'

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
			canvas.props.strokes[0].points.push({x: 10, y: 13});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('does not re-render when nothing changed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
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

		it('is updated when at least two points are added (sampling rate of ploma)', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.push({x: 10, y: 13});
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({x: 10, y: 14});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is not redrawn when point is only added', () => {
			let hasRun = false;
			canvas.props.strokes[0].points.push({x: 10, y: 13});
			canvas.redrawEverything = () => {
				hasRun = true;
			}
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		})

		it('is not redrawn when stroke is only started', () => {
			let hasRun = false;
			canvas.props.strokes.push({
				points: [{x: 10, y: 13}]
			});
			canvas.redrawEverything = () => {
				hasRun = true;
			}
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		})

		it('is not redrawn when first stroke is only started', () => {
			let hasRun = false;
			_.remove(canvas.props.strokes, canvas.props.strokes[0]);
			canvas.componentDidUpdate();
			canvas.props.strokes.push = {
				points: [{ x: 10, y: 10 }]
			};
			canvas.redrawEverything = () => {
				hasRun = true;
			}
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		})

		it('changes the image when two strokes are removed', () => {
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let imageDataBetween = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBetween)).to.not.equal(hashCode(imageDataBefore));
		})

	})

	describe('Changes in Ploma make that it', () => {

		it('doesn\'t change the image when removing two strokes, re-rendering, adding them again, and re-rendering', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let imageDataBefore = canvas.refs.canvas.toDataURL();
			let lost = canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let imageDataBetween = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataBetween)).to.not.equal(hashCode(imageDataBefore));
			canvas.props.strokes[0].points.push(lost[0]);
			canvas.props.strokes[0].points.push(lost[1]);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.toDataURL();
			expect(hashCode(imageDataAfter)).to.equal(hashCode(imageDataBefore));
		})

		it('renders the same image different on another canvas', () => {
			let canvas1 = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let canvas2 = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let imageData1 = canvas1.refs.canvas.toDataURL();
			let imageData2 = canvas2.refs.canvas.toDataURL();
			expect(hashCode(imageData1)).to.not.equal(hashCode(imageData2));
		})

		it('renders the same strokes differently on different coordinates', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
			}, {
				points: [{x:20, y:10}, {x:20, y:11}, {x:20, y:12}, {x:20, y:13}]
			}])
			let imageData1 = canvas.refs.canvas.getContext('2d').getImageData(8, 8, 4, 7);
			let imageData2 = canvas.refs.canvas.getContext('2d').getImageData(18, 8, 4, 7);
			expect(hashCode(imageData1.data.join())).to.not.deep.equal(hashCode(imageData2.data.join()));
		})

	})

})