import { mountApp, dismountApp, renderApplicationWithState, getCanvasNodes } from './helpers';
import { forEach } from 'lodash';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

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

	describe('Pressing the cmd key', () => {

		it('enables events on canvasses', () => {
			let canvasJson = canvasWithTwoStrokes.json;
			let oldAddEventListener = window.addEventListener;
			let that = window;
			let listeners = [];
			window.addEventListener = function (type, listener) {
				listeners.push({
					type: type,
					callback: listener
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			expect(getCanvasNodes()[0].parentNode.style.getPropertyValue('pointer-events')).to.equal('none');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					metaKey: true,
					ctrlKey: false
				});
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(getCanvasNodes()[0].parentNode.style.getPropertyValue('pointer-events')).to.equal('auto');	
		});

		it('disables events on window div', () => {
			let canvasJson = canvasWithTwoStrokes.json;
			let oldAddEventListener = window.addEventListener;
			let that = window;
			let listeners = [];
			window.addEventListener = function (type, listener) {
				listeners.push({
					type: type,
					callback: listener
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('auto');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					metaKey: true,
					ctrlKey: false
				});
			});
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('none');	
		});
	});

});
