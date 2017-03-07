import { forEach } from 'lodash';
import { mountApp, dismountApp, renderApplicationWithState, getCanvasNodes } from './helpers';
import canvasWithTwoStrokes from './data/canvasWithTwoStrokes.json';

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
			const canvasJson = canvasWithTwoStrokes.json;
			const oldAddEventListener = window.addEventListener;
			const that = window;
			const listeners = [];
			window.addEventListener = function addEventListener(type, listener) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			expect(getCanvasNodes()[0].parentNode.style.getPropertyValue('pointer-events')).to.equal('none');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					metaKey: true,
					ctrlKey: false,
				});
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(getCanvasNodes()[0].parentNode.style.getPropertyValue('pointer-events')).to.equal('auto');
		});

		it('disables events on window div', () => {
			const canvasJson = canvasWithTwoStrokes.json;
			const oldAddEventListener = window.addEventListener;
			const that = window;
			const listeners = [];
			window.addEventListener = function addEventListener(type, listener) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.apply(that, arguments);
			};
			renderApplicationWithState(canvasJson);
			expect(getCanvasNodes()).to.have.length(3);
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('auto');
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					metaKey: true,
					ctrlKey: false,
				});
			});
			expect(document.getElementsByClassName('window')[0].style.getPropertyValue('pointer-events')).to.equal('none');
		});
	});
});
