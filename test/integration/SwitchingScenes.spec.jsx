import { findDOMNode } from 'react-dom';
import { createAppStore, renderApplicationWithStore, mountApp, dismountApp } from './helpers';
import { nextScene } from 'actions/drawing';
import { cloneDeep } from 'lodash';

'use strict';

let getTimelineCanvasNodes = () => {
	return document.getElementById('configuration').getElementsByTagName('canvas');
};

describe('Switching Scenes', () => {

	beforeEach(() => {
		mountApp();
	});
	
	afterEach(() => {
		dismountApp();
	});

	describe('to the second not yet existing Scene', () => {
		it('clears the timeline', () => {
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
			let store = createAppStore(canvasJson);
			renderApplicationWithStore(store);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(0);
		});
	});

	describe('to the second existing and drawn Scene', () => {
		it('shows the existing sketches in second scene', () => {
			let canvasJson = cloneDeep(require('json!./data/canvasWithTwoScenes.json').json);
			canvasJson.content.sceneIndex = 0;
			let store = createAppStore(canvasJson);
			renderApplicationWithStore(store);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(1);
		});

		it('keeps the timeline slider to the very right', () => {
			let canvasJson = cloneDeep(require('json!./data/canvasWithTwoScenes.json').json);
			canvasJson.content.sceneIndex = 0;
			let store = createAppStore(canvasJson);
			let renderedApp = renderApplicationWithStore(store);
			store.dispatch(nextScene());
			let domApp = findDOMNode(renderedApp);
			let handle = domApp.getElementsByClassName('rc-slider-handle')[0];
			let relativeHandlePosition = parseInt(handle.style.getPropertyValue('left'));
			expect(relativeHandlePosition).to.equal(100);
		});
	});
});