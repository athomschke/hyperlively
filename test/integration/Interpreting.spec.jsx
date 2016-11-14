import { renderApplicationWithState, mountApp, dismountApp, getCanvasNodes } from './helpers';
import { forEach, cloneDeep } from 'lodash';

'use strict';

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

	describe('Hidden strokes', () => {
		it('are not part of a scene', () => {
			let canvasJson = cloneDeep(require('json!./data/canvasWithTwoStrokes.json').json);
			canvasJson.threshold = 1500;
			canvasJson.handwritingRecognition = true;
			forEach(canvasJson.undoableScenes.present[0].strokes, (stroke) => {
				stroke.hidden = true;
			});
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(1);
		});
	});

});
