import TestUtils from 'react-addons-test-utils';
import { createAppStore, renderApplicationWithStore, mountApp, dismountApp } from './helpers';
import { nextScene } from 'actions/drawing';
import { cloneDeep } from 'lodash';

'use strict';

let getTimelineCanvasNodes = () => {
	return document.getElementById('configuration').getElementsByTagName('canvas');
};

const createStoreAndRenderAppAtPage = (pageNumber) => {
	let canvasJson = cloneDeep(require('json!./data/canvasWithTwoScenes.json').json);
	canvasJson.content.sceneIndex = pageNumber;
	let store = createAppStore(canvasJson);
	renderApplicationWithStore(store);
	return store;
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
			let store = createStoreAndRenderAppAtPage(1);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(0);
		});
	});

	describe('to the second existing and drawn Scene', () => {
		it('shows the existing sketches in second scene', () => {
			let store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(1);
		});

		it('keeps the timeline slider to the very right', () => {
			let store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			let rail = document.getElementsByClassName('rc-slider-rail')[0];
			let rightPosition = rail.offsetWidth - 10;
			let relativeHandlePosition = document.getElementsByClassName('rc-slider-handle')[0].offsetLeft;
			expect(relativeHandlePosition).to.equal(rightPosition);
		});

		it('allows undoing the second scene and redoing again', () => {
			let store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			let rail = document.getElementsByClassName('rc-slider-rail')[0];
			TestUtils.Simulate.mouseDown(rail, {
				pageX: 0,
				button: 0
			});
			TestUtils.Simulate.mouseDown(rail, {
				pageX: rail.offsetWidth + 20,
				button: 0
			});
			let rightPosition = rail.offsetWidth - 10;
			let relativeHandlePosition = document.getElementsByClassName('rc-slider-handle')[0].offsetLeft;
			expect(relativeHandlePosition).to.equal(rightPosition);
		});
	});
});