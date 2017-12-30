import { findDOMNode } from 'react-dom';
import { cloneDeep } from 'lodash';
import { point } from 'test/helpers';
import { hashCode, mountApp, dismountApp, getCanvasNodes, getWindowNode, getCombinedCanvas, renderApplicationWithState, manuallyDrawStrokes, gotToHalfTimeInApp } from './helpers';
import emptyCanvas from './data/emptyCanvas.json';

describe('Integration', () => {
	let xhr;

	beforeEach(() => {
		xhr = sinon.useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('undoing', () => {
		it('keeps the canvas at content size', () => {
			const clonedEmptyCanvas = cloneDeep(emptyCanvas);
			clonedEmptyCanvas.json.threshold = 10;
			const renderedApp = renderApplicationWithState(clonedEmptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [point(10, 10, 100), point(10, 30, 101), point(10, 60, 102)],
			}, {
				points: [point(20, 10, 130), point(20, 30, 131), point(20, 60, 132)],
			}]);
			expect(getCanvasNodes()).to.have.length(3);
			const domApp = findDOMNode(renderedApp);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('width'), 10)).to.equal(10);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('height'), 10)).to.equal(60);
			gotToHalfTimeInApp(domApp);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('width'), 10)).to.equal(10);
			expect(parseInt(getCanvasNodes()[0].parentNode.style.getPropertyValue('height'), 10)).to.equal(60);
		});

		it('affects the canvas', () => {
			const clonedEmptyCanvas = cloneDeep(emptyCanvas);
			const renderedApp = renderApplicationWithState(clonedEmptyCanvas.json);
			manuallyDrawStrokes(getWindowNode(), [{
				points: [point(10, 10), point(10, 30), point(10, 60)],
			}, {
				points: [point(20, 10), point(20, 30), point(20, 60)],
			}]);
			const domApp = findDOMNode(renderedApp);
			return getCombinedCanvas().then((oldCombinedCanvas) => {
				const beforeUndoImageData = oldCombinedCanvas.toDataURL();
				gotToHalfTimeInApp(domApp);
				return getCombinedCanvas().then((newCombinedCanvas) => {
					const afterUndoImageData = newCombinedCanvas.toDataURL();
					expect(hashCode(beforeUndoImageData)).to.not.equal(hashCode(afterUndoImageData));
				});
			});
		});
	});
});
