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

	describe('Pressing the cmd key', () => {

		it('enables events on canvasses', () => {
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
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
			expect(document.getElementsByTagName('canvas')).to.have.length(3);
			expect(document.getElementsByTagName('canvas')[0].style.getPropertyValue('pointer-events')).to.equal('none');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback();
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(document.getElementsByTagName('canvas')[0].style.getPropertyValue('pointer-events')).to.equal('auto');	
		});

		it('disables events on window div', () => {
			let canvasJson = require('json!./data/canvasWithTwoStrokes.json').json;
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
			expect(document.getElementsByTagName('canvas')).to.have.length(3);
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('auto');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback();
			});
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('none');	
		});
	});

});
