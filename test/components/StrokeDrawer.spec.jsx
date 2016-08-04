import Canvas from 'components/StrokeDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { hashCode, point } from '../helpers';

let renderPlomaCanvasWithStrokes = (strokes, uniqueCanvasFactor) => {
	return TestUtils.renderIntoDocument(<Canvas
		usePloma={true}
		bounds={{
			width: 1000,
			height: 500,
			x: 0,
			y: 0
		}}
		uniqueCanvasFactor={uniqueCanvasFactor || Math.random()}
		strokes={strokes}
	></Canvas>);
}

'use strict'

describe('StrokeDrawer', () => {

	let canvas;

	describe('plain rendered image', () => {

		beforeEach(() => {
			canvas = TestUtils.renderIntoDocument(<Canvas
				usePloma={false}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0
				}}
				strokes={[{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}]
				}]}
			></Canvas>);
		})

		it('is updated when a point is added', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.push({x: 10, y: 13});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('does not re-render when nothing changed', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
		})

	})

	describe('ploma rendered image', () => {

		beforeEach(() => {
			canvas = TestUtils.renderIntoDocument(<Canvas
				usePloma={true}
				bounds={{
					width: 1000,
					height: 500,
					x: 0,
					y: 0
				}}
				strokes={[{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x: 10, y: 13}]
				}]}
			></Canvas>);
		})

		it('is updated when at least two points are added (sampling rate of ploma)', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.push({x: 10, y: 15});
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({x: 10, y: 16});
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is updated when a point is removed', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter));
		})

		it('is not redrawn when point is only added', () => {
			let hasRun = false;
			canvas.props.strokes[0].points.push({x: 10, y: 15});
			canvas.redrawEverything = () => {
				hasRun = true;
			}
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		})

		it('is not redrawn when stroke is only started', () => {
			let hasRun = false;
			canvas.props.strokes.push({
				points: [{x: 10, y: 15}]
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
			canvas.props.strokes.push({
				points: [{ x: 10, y: 10 }]
			});
			canvas.redrawEverything = () => {
				hasRun = true;
			}
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		})

		it('changes the image when two points are removed', () => {
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let imageDataBetween = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBetween)).to.not.equal(hashCode(imageDataBefore));
		})

	})

	describe('Changes in Ploma make that it', () => {

		it('doesn\'t change the image when removing two strokes, re-rendering, adding them again, and re-rendering', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			let lost = canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let imageDataBetween = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBetween)).to.not.equal(hashCode(imageDataBefore));
			canvas.props.strokes[0].points.push(lost[0]);
			canvas.props.strokes[0].points.push(lost[1]);
			canvas.componentDidUpdate();
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataAfter)).to.equal(hashCode(imageDataBefore));
		})

		it('renders the same image different on another canvas', () => {
			let canvas1 = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let canvas2 = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
			}])
			let imageData1 = canvas1.refs.canvas.refs.node.toDataURL();
			let imageData2 = canvas2.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageData1)).to.not.equal(hashCode(imageData2));
		})

		it.skip('renders the same strokes differently on different coordinates with high uniqueCanvasFactor', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
				finished: true
			}, {
				points: [{x:20, y:10}, {x:20, y:11}, {x:20, y:12}, {x:20, y:13}],
				finished: true
			}], 0.9)
			let imageData1 = canvas.refs.canvas.refs.node.getContext('2d').getImageData(8, 8, 4, 7);
			let imageData2 = canvas.refs.canvas.refs.node.getContext('2d').getImageData(18, 8, 4, 7);
			expect(hashCode(imageData1.data.join())).to.not.deep.equal(hashCode(imageData2.data.join()));
		})

		it.skip('renders the same strokes differently on different coordinates with low uniqueCanvasFactor', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
				finished: true
			}, {
				points: [{x:20, y:10}, {x:20, y:11}, {x:20, y:12}, {x:20, y:13}],
				finished: true
			}], 0.2)
			let imageData1 = canvas.refs.canvas.refs.node.getContext('2d').getImageData(8, 8, 4, 7);
			let imageData2 = canvas.refs.canvas.refs.node.getContext('2d').getImageData(18, 8, 4, 7);
			expect(hashCode(imageData1.data.join())).to.not.deep.equal(hashCode(imageData2.data.join()));
		})

	})

	describe('drawing with Ploma', () => {

		it('does nothing when only one point of a stroke is added', () => {
			let canvas = renderPlomaCanvasWithStrokes([{
				points: []
			}])
			canvas.props.strokes[0].points.push({ x:20, y:10 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x:20, y:11 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x:20, y:12 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x:20, y:13 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x:20, y:14 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].finished = true;
			canvas.componentDidUpdate();
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes.push({
				points: [{ x:40, y:14 }]
			});
			canvas.componentDidUpdate();
			expect(hashCode(canvas.refs.canvas.refs.node.toDataURL())).to.equal(hashCode(imageDataBefore))
		})

	})

	describe('providing bounds', () => {

		it('Moves the canvas to its position', () => {
			let canvas = TestUtils.renderIntoDocument(<Canvas
				bounds={{
					width: 100,
					height: 50,
					x: 10,
					y: 10
				}}
				strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
			></Canvas>)
			expect(canvas.refs.canvas.refs.node.style.getPropertyValue('top')).to.equal('10px')
			expect(canvas.refs.canvas.refs.node.style.getPropertyValue('left')).to.equal('10px')
		})

	})

	describe('enabling ploma', () => {

		it('is possible when at the same time changing strokes', () => {
			var TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { usePloma: false };
				},
				render() {
					return <Canvas
						ref="sut"
						usePloma={this.state.usePloma}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10
						}}
						strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
					></Canvas>
				}
			}));

			var parent = TestUtils.renderIntoDocument(TestParent());
			let canvas = parent.refs.sut;
			let imageDataBefore = canvas.refs.canvas.refs.node.toDataURL();
			canvas.props.strokes[0].points.push(point(12,12));
			parent.setState({
				usePloma: true
			})
			let imageDataAfter = canvas.refs.canvas.refs.node.toDataURL();
			expect(hashCode(imageDataBefore)).to.not.equal(hashCode(imageDataAfter))
		})

	})

})