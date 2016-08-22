import { hashCode, renderApplicationWithState, mountApp, dismountApp, getWindowNode, getCombinedCanvas, manuallyDrawStrokes } from './helpers';
import { cloneDeep } from 'lodash';

'use strict';

let getPointsFromJSON = (json) => {
	return json.undoableScenes.present[0].strokes;
};

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
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
			renderApplicationWithState(canvasJson);
			let renderedStrokesData = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			renderApplicationWithState(require('json!./data/emptyCanvas.json').json);
			let strokes = getPointsFromJSON(canvasJson);
			manuallyDrawStrokes(getWindowNode(), strokes);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.equal(hashCode(renderedStrokesData));
		});

		it('two strokes looks the same as adding two strokes point by point when ploma is enabled', () => {
			let canvasJsonConfig = require('json!./data/canvasWithIrregularStrokesWithPloma.json').json;
			renderApplicationWithState(canvasJsonConfig);
			let renderedStrokesData = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			let emptyCanvasConfig = cloneDeep(require('json!./data/emptyCanvas.json')).json;
			emptyCanvasConfig.ploma.uniqueCanvasFactor = canvasJsonConfig.ploma.uniqueCanvasFactor;
			emptyCanvasConfig.ploma.usePloma = true;
			emptyCanvasConfig.threshold = 1;
			renderApplicationWithState(emptyCanvasConfig);
			let strokes = getPointsFromJSON(canvasJsonConfig);
			manuallyDrawStrokes(getWindowNode(), strokes);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.equal(hashCode(renderedStrokesData));
		});
	});

});
