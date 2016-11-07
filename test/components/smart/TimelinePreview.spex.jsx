import TimelinePreview from 'components/smart/TimelinePreview';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';

describe('TimelinePreview', () => {

	describe('rendering strokes to previews', () => {

		it('captures no events on a preview canvas', () => {
			let timeline = TestUtils.renderIntoDocument(<TimelinePreview
				max={4}
				strokes={[{
					points: [point(-15,-10), point(-15,-15), point(-10,-15), point(-10,-10)],
					actionIndex: 0
				}]}
			></TimelinePreview>);
			let canvasNode = timeline.refs.previewContainer.getElementsByTagName('canvas')[0];
			expect(canvasNode.parentNode.style.getPropertyValue('pointer-events')).to.equal('none');
		});

	});

	describe('scaling strokes to fit into preview', () => {

		let scale = TimelinePreview.prototype.scaleToTime;

		it('Scales to maximum width', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20)]
			}];
			let maxWidth = 10;
			let scaledStrokes = scale(strokes, maxWidth, Infinity);
			expect(scaledStrokes[0].points[0].x).to.equal(0);
			expect(scaledStrokes[0].points[1].x).to.equal(5);
			expect(scaledStrokes[0].points[2].x).to.equal(10);
		});

		it('Scales to maximum height', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20)]
			}];
			let maxHeight = 10;
			let scaledStrokes = scale(strokes, Infinity, maxHeight);
			expect(scaledStrokes[0].points[0].y).to.equal(0);
			expect(scaledStrokes[0].points[1].y).to.equal(5);
			expect(scaledStrokes[0].points[2].y).to.equal(10);
		});

		it('does not scale if small enough', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20)]
			}];
			let maxWidth = 30;
			let scaledStrokes = scale(strokes, maxWidth, Infinity);
			expect(scaledStrokes[0].points[0].x).to.equal(0);
			expect(scaledStrokes[0].points[1].x).to.equal(10);
			expect(scaledStrokes[0].points[2].x).to.equal(20);
		});

	});

	describe('fitting passepartout to preview width', () => {

		let getFittedWidth = TimelinePreview.prototype.getFittedWidth;

		it('defaults to zero', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20), point(30,30)]
			}];
			let maxWidth = 0;
			let sliderWidth = 100;
			let fittedWidth = getFittedWidth(strokes, sliderWidth, maxWidth);
			expect(fittedWidth).to.equal(0);
		});

		it('spans half the slider when canvas contains half the points', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20), point(30,30)]
			}];
			let maxWidth = 8;
			let sliderWidth = 100;
			let fittedWidth = getFittedWidth(strokes, sliderWidth, maxWidth);
			expect(fittedWidth).to.equal(50);
		});

		it('has the slider height', () => {
			let strokes = [{
				points: [point(0,0), point(10,10), point(20,20), point(30,30)]
			}];
			let maxWidth = 8;
			let sliderWidth = 100;
			let fittedWidth = getFittedWidth(strokes, sliderWidth, maxWidth);
			expect(fittedWidth).to.equal(50);
		});

	});
	
});