// @flow
import { expect } from 'chai';
import { forEach } from 'lodash';
import { useFakeXMLHttpRequest } from 'sinon';

import { mountApp, dismountApp, renderApplicationWithState, getCanvasNodes } from './helpers';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

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

	describe('Pressing the cmd key', () => {
		it('enables events on canvasses', () => {
			const that = window;
			const canvasJson = canvasWithTwoStrokes.json;
			const oldAddEventListener = window.addEventListener;
			const listeners = [];
			window.addEventListener = function addEventListener(type, listener, ...args) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.call(that, type, listener, ...args);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			const parentNode = getCanvasNodes()[0].parentNode;

			if (!(parentNode instanceof HTMLElement)) {
				throw new Error('Need a parent node to canvas');
			}

			expect(parentNode.style.getPropertyValue('pointer-events')).to.equal('none');
			forEach(listeners, (listener) => {
				if (listener.type === 'keydown') {
					listener.callback({
						metaKey: true,
						ctrlKey: false,
					});
				}
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(parentNode.style.getPropertyValue('pointer-events')).to.equal('auto');
		});

		it('disables events on window div', () => {
			const canvasJson = canvasWithTwoStrokes.json;
			const oldAddEventListener = window.addEventListener;
			const that = window;
			const listeners = [];
			window.addEventListener = function addEventListener(type, listener, ...args) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.call(that, type, listener, ...args);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('auto');
			forEach(listeners, (listener) => {
				if (listener.type === 'keydown') {
					listener.callback({
						metaKey: true,
						ctrlKey: false,
					});
				}
			});
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('none');
		});
	});
});
