import PlainDrawer from 'components/smart/PlainDrawer';
import TestUtils from 'react-addons-test-utils';
import React, { Component } from 'react';
import { sum, forEach, remove } from 'lodash';

'use strict';

class WrappedPlainDrawer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			width: props.width,
			height: props.height
		};
	}

	render() {
		return <PlainDrawer ref='plainDrawer' {...this.props} {...this.state} />;
	}
}

let renderWrapperAroundComponentWithProps = (props) => {
	return TestUtils.renderIntoDocument(<WrappedPlainDrawer {...props}
		bounds={{
			width: 1000,
			height: 500,
			x: 0,
			y: 0
		}}
		strokes={props.strokes || []}
		active ={props.active}
	/>);
};

let renderComponentWithProps = (props) => {
	return TestUtils.renderIntoDocument(<PlainDrawer
		bounds={{
			width: 1000,
			height: 500,
			x: 0,
			y: 0
		}}
		strokes={props.strokes || []}
		active ={props.active}
		finished ={props.finished}
	/>);
};

let canvasImageData = (canvas) => {
	return canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height);
};

describe('PlainDrawer', () => {

	let canvas;

	describe('plain rendered image', () => {

		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}]
			});
		});

		it('is updated when a point is added', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].points.push({x: 10, y: 14});
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

		it('does not re-render when nothing changed', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.equal(sumBefore);
		});

	});

	describe('rendering an empty canvas', () => {

		it('works for only one point on canvas', () => {
			let canvas =  renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}]
				}]
			});
			expect(canvas).to.exist;
		});
	});

	describe('activating events on a canvas', () => {

		it('enables pointer events on its containing div when it is finished', () => {
			let canvas = renderComponentWithProps({
				active: true,
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}],
				finished: true
			});

			expect(canvas.refs.node.style.getPropertyValue('pointer-events')).to.equal('auto');
		});

		it('does not enable pointer events on its containing div when its not finished', () => {
			let canvas = renderComponentWithProps({
				active: true,
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}],
				finished: false
			});

			expect(canvas.refs.node.style.getPropertyValue('pointer-events')).to.equal('none');
		});

	});

	describe('finishing a stroke', () => {

		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}]
			});
		});

		it('adds the last point', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes[0].finished = true;
			canvas.props.strokes[0].points.push({x: 10, y: 14});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});

	});

	describe('changing the positions of strokes', () => {

		it('does not change the image data', () => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}]
				}]
			});
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			forEach(canvas.props.strokes[0].points, (point) => {
				point.x += 10;
				point.y += 10;
			});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.equal(sumBefore);
		});

		it('does nothing when no strokes are given', () => {
			canvas = renderComponentWithProps({
				strokes: []
			});
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			forEach((canvas.props.strokes[0] || {}).points, (point) => {
				point.x += 10;
				point.y += 10;
			});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.equal(sumBefore);
		});

	});

	describe('taking away the second stroke', () => {
		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				},{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				}]
			});
		});

		it('draws only the first', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			remove(canvas.props.strokes, canvas.props.strokes[1]);
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.not.equal(sumBefore);
		});
	});

	describe('starting a stroke', () => {
		beforeEach(() => {
			canvas = renderComponentWithProps({
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				}]
			});
		});

		it('does nothing, really', () => {
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes.push({
				points: [{x:20, y:10}]
			});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumAfter).to.equal(sumBefore);
		});
	});

	describe('changing the canvasses dimensions', () => {

		it('does not change the image', (done) => {
			let wrappedComponent = renderWrapperAroundComponentWithProps({
				width: 100,
				height: 200,
				strokes: [{
					points: [{x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}],
					finished: true
				}]
			});
			let canvas = wrappedComponent.refs.plainDrawer;
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			wrappedComponent.setState({
				width: 150
			}, () => {			
				wrappedComponent.setState({
					width: 100
				}, () => {
					let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
					expect(sumAfter).to.equal(sumBefore);
					wrappedComponent.setState({
						height: 150
					}, () => {
						wrappedComponent.setState({
							height: 200
						}, () => {
							sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
							expect(sumAfter).to.equal(sumBefore);
							done();
						});
					});
				});
			});
		});
	});

});