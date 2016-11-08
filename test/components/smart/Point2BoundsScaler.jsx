import Point2BoundsScaler from 'components/dumb/Point2BoundsScaler';
import { point } from '../../helpers';

describe('Point2BoundsScaler', () => {

	describe('scaling strokes to fit into preview', () => {

		let scale = Point2BoundsScaler.prototype.scaleToTime;

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

		let getFittedWidth = Point2BoundsScaler.prototype.getFittedWidth;

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