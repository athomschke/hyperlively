import { BallpointPen } from 'ploma';
import { sum } from 'lodash';
import { combineCanvasses } from './helpers';

describe('Integration', () => {
	describe('dummy testing', () => {
		it('combining two canvasses looks the same as writing their content on the same canvas', () => {
			const bothDrawnOnOneCanvas = document.createElement('canvas');
			bothDrawnOnOneCanvas.setAttribute('width', 100);
			bothDrawnOnOneCanvas.setAttribute('height', 100);
			bothDrawnOnOneCanvas.style.setProperty('top', 0);
			bothDrawnOnOneCanvas.style.setProperty('left', 0);
			const firstCanvas = bothDrawnOnOneCanvas.cloneNode();
			const secondCanvas = bothDrawnOnOneCanvas.cloneNode();
			// draw first stroke
			bothDrawnOnOneCanvas.getContext('2d').fillStyle = 'rgba(1, 1, 1, 0)';
			bothDrawnOnOneCanvas.getContext('2d').beginPath();
			bothDrawnOnOneCanvas.getContext('2d').moveTo(10, 10);
			bothDrawnOnOneCanvas.getContext('2d').lineTo(13, 13);
			bothDrawnOnOneCanvas.getContext('2d').stroke();
			bothDrawnOnOneCanvas.getContext('2d').closePath();
			firstCanvas.getContext('2d').fillStyle = 'rgba(1, 1, 1, 0)';
			firstCanvas.getContext('2d').beginPath();
			firstCanvas.getContext('2d').moveTo(10, 10);
			firstCanvas.getContext('2d').lineTo(13, 13);
			firstCanvas.getContext('2d').stroke();
			firstCanvas.getContext('2d').closePath();
			// draw second stroke
			bothDrawnOnOneCanvas.getContext('2d').beginPath();
			bothDrawnOnOneCanvas.getContext('2d').moveTo(20, 20);
			bothDrawnOnOneCanvas.getContext('2d').lineTo(23, 23);
			bothDrawnOnOneCanvas.getContext('2d').stroke();
			bothDrawnOnOneCanvas.getContext('2d').closePath();
			secondCanvas.getContext('2d').fillStyle = 'rgba(1, 1, 1, 0)';
			secondCanvas.getContext('2d').beginPath();
			secondCanvas.getContext('2d').moveTo(20, 20);
			secondCanvas.getContext('2d').lineTo(23, 23);
			secondCanvas.getContext('2d').stroke();
			secondCanvas.getContext('2d').closePath();
			// get data
			const combinedCanvasPromise = combineCanvasses([firstCanvas, secondCanvas], 100, 100);
			return combinedCanvasPromise.then((combinedCanvas) => {
				expect(combinedCanvas.toDataURL()).to.equal(bothDrawnOnOneCanvas.toDataURL());
			})
		});
	});

	describe('Ploma', () => {
		it('can draw a stroke', () => {
			// This setup requires a packed derandomized ploma - when writing this test,
			// derandomization was a branch in the ploma repo. So checkout ploma, switch to
			// derandomization, npm run build, npm run pack, go to hperlively, run npm install
			// ../ploma/[packname] and run the test again.
			const canvas = document.createElement('canvas');
			const position = 0;
			const extent = 100;
			const pressure = 0.95;
			const canvasFactor = 0.35;
			canvas.setAttribute('width', extent);
			canvas.setAttribute('height', extent);
			canvas.style.setProperty('top', position);
			canvas.style.setProperty('left', position);
			const plomaConfig = {
				uniqueCanvasFactor: canvasFactor,
				paperColor: 'rgba(0, 0, 0, 0)',
			};
			const ballpointPen = new BallpointPen(canvas, plomaConfig);
			ballpointPen.setSample(1);
			const oldImageData = canvas.getContext('2d').getImageData(position, position, extent, extent);
			ballpointPen.beginStroke(10, 10, pressure);
			ballpointPen.extendStroke(11, 11, pressure);
			ballpointPen.extendStroke(12, 12, pressure);
			ballpointPen.extendStroke(13, 13, pressure);
			ballpointPen.extendStroke(14, 14, pressure);
			ballpointPen.endStroke(15, 15, pressure);
			const newImageData = canvas.getContext('2d').getImageData(position, position, extent, extent);
			expect(sum(oldImageData.data)).to.not.equal(sum(newImageData.data));
		});
	});
});
