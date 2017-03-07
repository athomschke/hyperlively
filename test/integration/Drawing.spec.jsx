import { hashCode, renderApplicationWithState, mountApp, dismountApp, getWindowNode, getCombinedCanvas, manuallyDrawStrokes } from './helpers';
import { cloneDeep } from 'lodash';
import emptyCanvas from './data/emptyCanvas.json';
import canvasWithIrregularStrokesWithPloma from './data/canvasWithIrregularStrokesWithPloma.json';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

let getPointsFromJSON = (json) => {
	return json.content.undoableScenes.present[0].strokes;
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
			let canvasJson = canvasWithTwoStrokes.json;
			renderApplicationWithState(canvasJson);
			let renderedStrokesData = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			renderApplicationWithState(emptyCanvas.json);
			let strokes = getPointsFromJSON(canvasJson);
			manuallyDrawStrokes(getWindowNode(), strokes);
			expect(hashCode(getCombinedCanvas().toDataURL())).to.equal(hashCode(renderedStrokesData));
		});

		it('two strokes looks the same as adding two strokes point by point when ploma is enabled', () => {
			let canvasJsonConfig = canvasWithIrregularStrokesWithPloma.json;
			renderApplicationWithState(canvasJsonConfig);
			let renderedStrokesDataBefore = getCombinedCanvas().toDataURL();
			dismountApp();
			mountApp();
			let emptyCanvasConfig = cloneDeep(emptyCanvas).json;
			emptyCanvasConfig.ploma.uniqueCanvasFactor = canvasJsonConfig.ploma.uniqueCanvasFactor;
			emptyCanvasConfig.ploma.usePloma = true;
			emptyCanvasConfig.threshold = 1;
			renderApplicationWithState(emptyCanvasConfig);
			let strokes = getPointsFromJSON(canvasJsonConfig);
			manuallyDrawStrokes(getWindowNode(), strokes);
			let renderedStrokesDataAfter = getCombinedCanvas().toDataURL();
			expect(hashCode(renderedStrokesDataAfter)).to.equal(hashCode(renderedStrokesDataBefore));
		});
	});

});
