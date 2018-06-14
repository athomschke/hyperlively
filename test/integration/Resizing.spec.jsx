// @flow
import { expect } from 'chai';
import { useFakeXMLHttpRequest } from 'sinon';

import { relativeDividerPosition } from 'src/client/app/reducers/defaultState';
import emptyCanvas from 'test/integration/data/emptyCanvas';

import { mountApp, dismountApp, renderApplicationWithState } from './helpers';

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

	describe('resizing the window', () => {
		beforeEach(() => {
			if (!(document.body instanceof HTMLElement)) {
				throw new Error('Need document body');
			}

			document.body.style.setProperty('margin', '0px');
		});

		it('shows the input window in 0.6 fullscreen width and full height per default', () => {
			const canvasJson = emptyCanvas();
			renderApplicationWithState(canvasJson);
			const windowNode = document.getElementsByClassName('window')[0];
			expect(Math.floor(windowNode.getBoundingClientRect().width))
				.to.equal(Math.floor(window.innerWidth * relativeDividerPosition));
			expect(Math.floor(windowNode.getBoundingClientRect().height))
				.to.equal(Math.floor(window.innerHeight));
		});

		it('shows the canvas in 0.6 fullscreen width and full height per default', () => {
			const canvasJson = emptyCanvas();
			renderApplicationWithState(canvasJson);
			const app = document.getElementById('app');
			if (!(app instanceof HTMLElement)) {
				throw new Error('Need an app');
			}
			const backgroundNode = app.children[0].children[0].children[0];
			expect(Math.floor(backgroundNode.getBoundingClientRect().width))
				.to.equal(Math.floor(window.innerWidth * relativeDividerPosition));
			expect(Math.floor(backgroundNode.getBoundingClientRect().height))
				.to.equal(Math.floor(window.innerHeight));
		});
	});
});
