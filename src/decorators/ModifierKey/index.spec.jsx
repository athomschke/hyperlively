// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { forEach } from 'lodash';

import ModifierKey from '.';

type MockedSubComponentProps = {
	cmdPressed: boolean;
}

const MockedSubComponent = ({ cmdPressed }: MockedSubComponentProps) => <div className={cmdPressed} />;

const MockedComponent = ModifierKey(MockedSubComponent);

describe('ModifierKey', () => {
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	describe('pressing a keyboard button', () => {
		it('is not handeled after dismount', () => {
			const modifierKeyComponent = mount(<MockedComponent />);
			let wasKeyDownHandlerRemoved = false;
			let wasKeyUpHandlerRemoved = false;
			window.removeEventListener = (listener) => {
				wasKeyDownHandlerRemoved = wasKeyDownHandlerRemoved || listener === 'keydown';
				wasKeyUpHandlerRemoved = wasKeyUpHandlerRemoved || listener === 'keyup';
			};
			modifierKeyComponent.instance().componentWillUnmount();
			expect(wasKeyDownHandlerRemoved).to.be.true();
			expect(wasKeyUpHandlerRemoved).to.be.true();
		});
	});

	describe('pressing cmd key', () => {
		it('sets cmdPressed state to true', () => {
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
			const modifierKeyComponent = mount(<MockedComponent />);
			expect(modifierKeyComponent.state('cmdPressed')).to.be.false();
			forEach(listeners, (listener) => {
				if (listener.type === 'keydown') {
					listener.callback({
						metaKey: true,
						ctrlKey: false,
					});
				}
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(modifierKeyComponent.state('cmdPressed')).to.be.true();
			expect(modifierKeyComponent.state('ctrlPressed')).to.be.false();
		});
	});

	describe('pressing ctrl key', () => {
		it('sets cmdPressed state to true', () => {
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
			const modifierKeyComponent = mount(<MockedComponent />);
			expect(modifierKeyComponent.state('ctrlPressed')).to.be.false();
			forEach(listeners, (listener) => {
				if (listener.type === 'keydown') {
					listener.callback({
						ctrlKey: true,
					});
				}
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(modifierKeyComponent.state('cmdPressed')).to.be.false();
			expect(modifierKeyComponent.state('ctrlPressed')).to.be.true();
		});
	});
});
