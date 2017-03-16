import { forEach } from 'lodash';
import { mountApp, dismountApp, renderApplicationWithState } from './helpers';
import emptyCanvas from './data/emptyCanvas.json';

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
			const oldWidth = window.innerWidth;
			const oldHeight = window.innerHeight;
			const canvasJson = emptyCanvas.json;
			const listeners = [];
			const oldAddEventListener = window.addEventListener;
			const that = window;
			window.addEventListener = function addEventListener(type, listener, ...args) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.call(that, type, listener, ...args);
			};
			renderApplicationWithState(canvasJson);
			const windowNode = document.getElementsByClassName('window')[0];
			expect(parseInt(windowNode.style.width, 10)).to.equal(window.innerWidth);
			expect(parseInt(windowNode.style.height, 10)).to.equal(window.innerHeight);
			window.innerHeight = 100;
			window.innerWidth = 100;
			forEach(listeners, (listener) => {
				if (listener.type === 'resize') {
					listener.callback({
						pageX: 100,
						pageY: 100,
					});
				}
			});
			expect(parseInt(windowNode.style.width, 10)).to.equal(window.innerWidth);
			expect(parseInt(windowNode.style.height, 10)).to.equal(window.innerHeight);
			window.addEventListener = oldAddEventListener.bind(window);
			window.innerWidth = oldWidth;
			window.innerHeight = oldHeight;
		});

		it('keeps the background in fullscreen size', () => {
			const oldWidth = window.innerWidth;
			const oldHeight = window.innerHeight;
			const canvasJson = emptyCanvas.json;
			const listeners = [];
			const oldAddEventListener = window.addEventListener;
			const that = window;
			window.addEventListener = function addEventListener(type, listener, ...args) {
				listeners.push({
					type,
					callback: listener,
				});
				oldAddEventListener.call(that, type, listener, ...args);
			};
			renderApplicationWithState(canvasJson);
			const backgroundNode = document.getElementById('app').children[0].children[0].children[0];
			expect(parseInt(backgroundNode.offsetWidth, 10)).to.equal(window.innerWidth);
			expect(parseInt(backgroundNode.offsetHeight, 10)).to.equal(window.innerHeight);
			window.innerHeight = 100;
			window.innerWidth = 100;
			forEach(listeners, (listener) => {
				if (listener.type === 'resize') {
					listener.callback({
						pageX: 100,
						pageY: 100,
					});
				}
			});
			expect(parseInt(backgroundNode.offsetWidth, 10)).to.equal(window.innerWidth);
			expect(parseInt(backgroundNode.offsetHeight, 10)).to.equal(window.innerHeight);
			window.addEventListener = oldAddEventListener.bind(window);
			window.innerWidth = oldWidth;
			window.innerHeight = oldHeight;
		});
	});
});
