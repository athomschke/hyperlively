import { useFakeXMLHttpRequest } from 'sinon';

import { relativeDividerPosition } from 'src/client/app/reducers/defaultState';

import { mountApp, dismountApp, renderApplicationWithState } from './helpers';
import emptyCanvas from './data/emptyCanvas.json';

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
			document.body.style.setProperty('margin', '0px');
		});

		it('shows the input window in 0.6 fullscreen width and full height per default', () => {
			const canvasJson = emptyCanvas.json;
			renderApplicationWithState(canvasJson);
			const windowNode = document.getElementsByClassName('window')[0];
			expect(Math.floor(windowNode.getBoundingClientRect().width))
				.to.equal(Math.floor(window.innerWidth * relativeDividerPosition));
			expect(Math.floor(windowNode.getBoundingClientRect().height))
				.to.equal(Math.floor(window.innerHeight));
		});

		it('shows the canvas in 0.6 fullscreen width and full height per default', () => {
			const canvasJson = emptyCanvas.json;
			renderApplicationWithState(canvasJson);
			const backgroundNode = document.getElementById('app').children[0].children[0].children[0];
			expect(Math.floor(backgroundNode.getBoundingClientRect().width))
				.to.equal(Math.floor(window.innerWidth * relativeDividerPosition));
			expect(Math.floor(backgroundNode.getBoundingClientRect().height))
				.to.equal(Math.floor(window.innerHeight));
		});
	});
});
