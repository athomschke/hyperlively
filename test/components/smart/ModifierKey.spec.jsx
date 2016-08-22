import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ModifierKey from 'components/smart/ModifierKey';
import { forEach } from 'lodash';

class MockedSubComponent extends React.Component {

	static propTypes = {
		cmdPressed: React.PropTypes.bool.isRequired
	};

	render () {
		return <div></div>;
	}
}

const MockedComponent = ModifierKey(MockedSubComponent);

describe('ModifierKey', () => {

	describe('pressing a keyboard button', () => {

		it('is not handeled after dismount', () => {
			let modifierKeyComponent = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
			let wasKeyDownHandlerRemoved = false;
			let wasKeyUpHandlerRemoved = false;
			window.removeEventListener = (listener) => {
				wasKeyDownHandlerRemoved = wasKeyDownHandlerRemoved || listener === 'keydown';
				wasKeyUpHandlerRemoved = wasKeyUpHandlerRemoved || listener === 'keyup';
			};
			modifierKeyComponent.componentWillUnmount();
			expect(wasKeyDownHandlerRemoved).to.be.true;
			expect(wasKeyUpHandlerRemoved).to.be.true;
		});
	});

	describe('pressing cmd key', () => {

		it('sets cmdPressed state to true', () => {
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
			let modifierKeyComponent = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
			expect(modifierKeyComponent.state.cmdPressed).to.be.false;
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					metaKey: true,
					ctrlKey: false
				});
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(modifierKeyComponent.state.cmdPressed).to.be.true;
			expect(modifierKeyComponent.state.ctrlPressed).to.be.false;
		});
	});

	describe('pressing ctrl key', () => {

		it('sets cmdPressed state to true', () => {
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
			let modifierKeyComponent = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
			expect(modifierKeyComponent.state.ctrlPressed).to.be.false;
			forEach(listeners, (listener) => {
				listener.type === 'keydown' && listener.callback({
					ctrlKey: true
				});
			});
			window.addEventListener = oldAddEventListener.bind(window);
			expect(modifierKeyComponent.state.cmdPressed).to.be.false;
			expect(modifierKeyComponent.state.ctrlPressed).to.be.true;
		});
	});
});
