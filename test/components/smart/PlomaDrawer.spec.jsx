import PlomaDrawer from 'components/smart/PlomaDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';
import { sum, remove, forEach } from 'lodash';

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

let canvasImageData = (canvas) => {
	return canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height);
};


describe('PlomaDrawer', () => {

	let canvas;

	describe('ploma rendered image', () => {

		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}]
			});
		});

		it('is updated when a point was added', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].points.push({x: 10, y: 15});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

		it('is updated when a point is removed', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].points.splice(-1);
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

		it('is not redrawn when point is only added', () => {
			let hasRun = false;
			canvas.props.strokes[0].points.push({x: 10, y: 15});
			canvas.redrawEverything = () => {
				hasRun = true;
			};
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		});

		it('is not redrawn when stroke is only started', () => {
			let hasRun = false;
			canvas.props.strokes.push({
				points: [{x: 10, y: 15}]
			});
			canvas.redrawEverything = () => {
				hasRun = true;
			};
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		});

		it('is not redrawn when first stroke is only started', () => {
			let hasRun = false;
			remove(canvas.props.strokes, canvas.props.strokes[0]);
			canvas.componentDidUpdate();
			canvas.props.strokes.push({
				points: [{ x: 10, y: 10 }]
			});
			canvas.redrawEverything = () => {
				hasRun = true;
			};
			canvas.componentDidUpdate();
			expect(hasRun).to.be.false;
		});

		it('changes the image when two points are removed', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

		it('finishes with the last point', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].finished = true;
			canvas.props.strokes[0].points.push({x: 10, y: 14});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

	});


	describe('Changes in Ploma make that it', () => {

		it('doesn\'t change the image when removing two strokes, re-rendering, adding them again, and re-rendering', () => {
			let canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}],
					finished: true
				}]
			});
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			let lost = canvas.props.strokes[0].points.splice(-2);
			canvas.componentDidUpdate();
			let sumBetween = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumBetween).to.not.equal(sumBefore);
			canvas.props.strokes[0].points.push(lost[0]);
			canvas.props.strokes[0].points.push(lost[1]);
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.equal(sumBefore);
		});

		it.skip('renders the same image different on another canvas', () => {
			renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
				}]
			});
			let sum1 = sum(canvasImageData(canvas.refs.canvas).data);
			renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}]
				}]
			});
			let sum2 = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sum1).to.not.equal(sum2);
		});

		it.skip('renders the same strokes differently on different coordinates with high uniqueCanvasFactor', () => {
			renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				}, {
					points: [{x:20, y:10}, {x:20, y:11}, {x:20, y:12}, {x:20, y:13}],
					finished: true
				}],
				uniqueCanvasFactor: 0.9
			});
			expect(false).to.be.true;
		});

		it.skip('renders the same strokes differently on different coordinates with low uniqueCanvasFactor', () => {
			renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				}, {
					points: [{x:20, y:10}, {x:20, y:11}, {x:20, y:12}, {x:20, y:13}],
					finished: true
				}],
				uniqueCanvasFactor: 0.2
			});
			expect(false).to.be.true;
		});

	});

	describe('drawing with Ploma', () => {

		it('does nothing when only one point of a stroke is added', () => {
			let canvas = renderComponentWithProps({
				strokes: [{
					points: []
				}]
			});
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
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes.push({
				points: [{ x:40, y:14 }]
			});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumBefore).to.equal(sumAfter);
		});

	});

	describe('changing the position of displayed points', () => {

		it('Does not trigger a complete rerendering', () => {
			let plomaDrawer = renderComponentWithProps({
				strokes: [{
					points: [point(10,10), point(10,11), point(10,12)]
				}]
			});
			let rerenderCalled = false;
			plomaDrawer.redrawEverything = () => {
				rerenderCalled = true;
			};
			
			forEach(plomaDrawer.props.strokes[0].points, (point) => {
				point.x += 10;
			});
			plomaDrawer.componentDidUpdate();
			expect(rerenderCalled).to.be.false;
		});

	});

});