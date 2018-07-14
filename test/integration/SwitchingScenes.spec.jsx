// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import { cloneDeep } from 'lodash';

import { nextScene } from 'src/actionCreators';

import { createAppStore, renderApplicationWithStore, mountApp, dismountApp } from './helpers';
import canvasWithTwoScenes from './data/canvasWithTwoScenes';

const getTimelineCanvasNodes = () => {
	const configuration = document.getElementById('configuration');
	if (!(configuration instanceof HTMLElement)) {
		throw new Error('Need a configuration element');
	}

	return configuration.getElementsByTagName('canvas');
};

const createStoreAndRenderAppAtPage = (pageNumber) => {
	const canvasJson = cloneDeep(canvasWithTwoScenes());
	canvasJson.data.sceneIndex = pageNumber;
	const store = createAppStore(canvasJson);
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
			const store = createStoreAndRenderAppAtPage(1);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(0);
		});
	});

	describe('to the second existing and drawn Scene', () => {
		it('shows the existing sketches in second scene', () => {
			const store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			expect(getTimelineCanvasNodes()).to.have.length(1);
		});

		it('keeps the timeline slider to the very right', () => {
			const store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			const rail = document.getElementsByClassName('rc-slider-rail')[0];
			const rightPosition = rail.offsetWidth - 10;
			const relativeHandlePosition = document.getElementsByClassName('rc-slider-handle')[0].offsetLeft;
			expect(relativeHandlePosition).to.equal(rightPosition);
		});

		it('allows undoing the second scene and redoing again', () => {
			const store = createStoreAndRenderAppAtPage(0);
			store.dispatch(nextScene());
			const rail = document.getElementsByClassName('rc-slider-rail')[0];
			TestUtils.Simulate.mouseDown(rail, {
				pageX: 0,
				button: 0,
			});
			TestUtils.Simulate.mouseDown(rail, {
				pageX: rail.offsetWidth + 20,
				button: 0,
			});
			const rightPosition = rail.offsetWidth - 10;
			const relativeHandlePosition = document.getElementsByClassName('rc-slider-handle')[0].offsetLeft;
			expect(relativeHandlePosition).to.equal(rightPosition);
		});
	});
});
