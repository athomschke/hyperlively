import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { sum } from 'lodash';

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

const canvasImageData = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);


describe('PlomaDrawer', () => {
	describe('drawing with Ploma', () => {
		it('does nothing when only one point of a stroke is added', () => {
			const canvas = renderComponentWithProps({
				strokes: [],
			});
			canvas.props.strokes.push({ points: [{ x: 20, y: 10 }] });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x: 20, y: 11 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x: 20, y: 12 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x: 20, y: 13 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].points.push({ x: 20, y: 14 });
			canvas.componentDidUpdate();
			canvas.props.strokes[0].finished = true;
			canvas.componentDidUpdate();
			const sumBefore = sum(canvasImageData(canvas.state.canvas).data);
			canvas.props.strokes.push({
				points: [{ x: 40, y: 14 }],
			});
			canvas.componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state.canvas).data);
			expect(sumBefore).to.equal(sumAfter);
		});

		it('can deal with empty strokes', () => {
			const canvas = renderComponentWithProps({
				strokes: [],
			});
			const sumBefore = sum(canvasImageData(canvas.state.canvas).data);
			canvas.props.strokes.push({ points: [] });
			canvas.componentDidUpdate();
			const sumAfter = sum(canvasImageData(canvas.state.canvas).data);
			expect(sumBefore).to.equal(sumAfter);
		});
	});
});
