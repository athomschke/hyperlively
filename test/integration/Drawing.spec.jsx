// @flow
import { expect } from 'chai';
import { useFakeXMLHttpRequest } from 'sinon';

import type { StateStroke, Stroke } from 'src/types';

import {
	hashCode, renderApplicationWithState, mountApp, dismountApp, getWindowNode, getCombinedCanvas, manuallyDrawStrokes,
} from './helpers';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes';
import emptyCanvas from './data/emptyCanvas';


const getPointsFromJSON = (json): Array<Stroke> => json.data.scenes.present[0].strokes.map(strokeReference => ({
	...strokeReference,
	...json.data.strokes.find(stateStroke => stateStroke.id === strokeReference.id),
}));

describe('Integration', () => {
	let xhr;

	beforeEach(() => {
		xhr = useFakeXMLHttpRequest();
		mountApp();
	});

	afterEach(() => {
		dismountApp();
		xhr.restore();
	});

	describe('drawing', () => {
		it('two strokes looks the same as adding two strokes point by point when ploma is disabled', () => {
			const canvasJson = canvasWithTwoStrokes();
			renderApplicationWithState(canvasJson);
			return getCombinedCanvas(100, 100).then((atOnceCombinedCanvas) => {
				const atOnceDataUrl = atOnceCombinedCanvas.toDataURL();
				dismountApp();
				mountApp();
				renderApplicationWithState(emptyCanvas());
				const strokes = getPointsFromJSON(canvasJson);
				manuallyDrawStrokes(getWindowNode(), strokes);
				return getCombinedCanvas(100, 100).then((stepwiseCombinedCanvas) => {
					const stepwiseDataUrl = stepwiseCombinedCanvas.toDataURL();
					expect(hashCode(stepwiseDataUrl)).to.equal(hashCode(atOnceDataUrl));
				});
			});
		});

		it('two strokes looks the same as adding two strokes point by point when ploma is enabled', () => {
			const canvasJsonConfig = canvasWithIrregularStrokesWithPloma();
			const emptyCanvasConfig = emptyCanvas();
			emptyCanvasConfig.ui.ploma.uniqueCanvasFactor = canvasJsonConfig.ui.ploma.uniqueCanvasFactor;
			emptyCanvasConfig.ui.ploma.usePloma = true;
			emptyCanvasConfig.ui.threshold = 1;
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
