import { cloneDeep } from 'lodash';

import { hashCode, renderApplicationWithState, mountApp, dismountApp, getWindowNode, getCombinedCanvas, manuallyDrawStrokes } from './helpers';
import emptyCanvas from './data/emptyCanvas.json';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma.json';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

const getPointsFromJSON = json => json.content.undoableScenes.present[0].strokes;

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

	describe('drawing', () => {
		it('two strokes looks the same as adding two strokes point by point when ploma is disabled', () => {
			const canvasJson = canvasWithTwoStrokes.json;
			renderApplicationWithState(canvasJson);
			return getCombinedCanvas(100, 100).then((atOnceCombinedCanvas) => {
				const atOnceDataUrl = atOnceCombinedCanvas.toDataURL();
				dismountApp();
				mountApp();
				renderApplicationWithState(emptyCanvas.json);
				const strokes = getPointsFromJSON(canvasJson);
				manuallyDrawStrokes(getWindowNode(), strokes);
				return getCombinedCanvas(100, 100).then((stepwiseCombinedCanvas) => {
					const stepwiseDataUrl = stepwiseCombinedCanvas.toDataURL();
					expect(hashCode(stepwiseDataUrl)).to.equal(hashCode(atOnceDataUrl));
				});
			});
		});

		it('two strokes looks the same as adding two strokes point by point when ploma is enabled', () => {
			const canvasJsonConfig = canvasWithIrregularStrokesWithPloma.json;
			const emptyCanvasConfig = cloneDeep(emptyCanvas).json;
			emptyCanvasConfig.ploma.uniqueCanvasFactor = canvasJsonConfig.ploma.uniqueCanvasFactor;
			emptyCanvasConfig.ploma.usePloma = true;
			emptyCanvasConfig.threshold = 1;
			renderApplicationWithState(emptyCanvasConfig);
			const strokes = getPointsFromJSON(canvasJsonConfig);
			return getCombinedCanvas(100, 100).then(() => {
				manuallyDrawStrokes(getWindowNode(), strokes);
				return getCombinedCanvas(100, 100).then((stepwiseCombinedCanvas) => {
					const stepwiseDataUrl = stepwiseCombinedCanvas.toDataURL();
					dismountApp();
					mountApp();
					renderApplicationWithState(canvasJsonConfig);
					return getCombinedCanvas(100, 100).then((atOnceCombinedCanvas) => {
						const atOnceDataUrl = atOnceCombinedCanvas.toDataURL();
						expect(hashCode(stepwiseDataUrl)).to.equal(hashCode(atOnceDataUrl));
					});
				});
			});
		});
	});
});
