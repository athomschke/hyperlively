import { mountApp, dismountApp, renderApplicationWithState } from './helpers';
import { forEach } from 'lodash';

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

	describe('resizing the window', () => {

		it('keeps the input window in fullscreen size', () => {
			let oldWidth = window.innerWidth;
			let oldHeight = window.innerHeight;
			let canvasJson = require('json!./data/emptyCanvas.json').json;
			let listeners = [];
			let oldAddEventListener = window.addEventListener;
			let that = window;
			window.addEventListener = function (type, listener) {
				listeners.push({
					type: type,
					callback: listener
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			let windowNode = document.getElementsByClassName('window')[0];
			expect(parseInt(windowNode.style.width)).to.equal(window.innerWidth);
			expect(parseInt(windowNode.style.height)).to.equal(window.innerHeight);
			window.innerHeight = 100;
			window.innerWidth = 100;
			forEach(listeners, (listener) => {
				listener.type === 'resize' && listener.callback({
					pageX: 100,
					pageY: 100
				});
			});
			expect(parseInt(windowNode.style.width)).to.equal(window.innerWidth);
			expect(parseInt(windowNode.style.height)).to.equal(window.innerHeight);
			window.addEventListener = oldAddEventListener.bind(window);
			window.innerWidth = oldWidth;
			window.innerHeight = oldHeight;
		});

		it('keeps the background in fullscreen size', () => {
			let oldWidth = window.innerWidth;
			let oldHeight = window.innerHeight;
			let canvasJson = require('json!./data/emptyCanvas.json').json;
			let listeners = [];
			let oldAddEventListener = window.addEventListener;
			let that = window;
			window.addEventListener = function (type, listener) {
				listeners.push({
					type: type,
					callback: listener
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			let backgroundNode = document.getElementById('app').children[0].children[0];
			expect(parseInt(backgroundNode.offsetWidth)).to.equal(window.innerWidth);
			expect(parseInt(backgroundNode.offsetHeight)).to.equal(window.innerHeight);
			window.innerHeight = 100;
			window.innerWidth = 100;
			forEach(listeners, (listener) => {
				listener.type === 'resize' && listener.callback({
					pageX: 100,
					pageY: 100
				});
			});
			expect(parseInt(backgroundNode.offsetWidth)).to.equal(window.innerWidth);
			expect(parseInt(backgroundNode.offsetHeight)).to.equal(window.innerHeight);
			window.addEventListener = oldAddEventListener.bind(window);
			window.innerWidth = oldWidth;
			window.innerHeight = oldHeight;
		});

	});

});
