import PlomaDrawer from 'components/smart/PlomaDrawer';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { sum } from 'lodash';

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

	describe('drawing with Ploma', () => {

		it('does nothing when only one point of a stroke is added', () => {
			let canvas = renderComponentWithProps({
				strokes: []
			});
			canvas.props.strokes.push({ points: [{ x:20, y:10 }]});
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

		it('can deal with empty strokes', () => {
			let canvas = renderComponentWithProps({
				strokes: []
			});
			let sumBefore = sum(canvasImageData(canvas.refs.canvas).data);
			canvas.props.strokes.push({ points: []});
			canvas.componentDidUpdate();
			let sumAfter = sum(canvasImageData(canvas.refs.canvas).data);
			expect(sumBefore).to.equal(sumAfter);
		});

	});

});