import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ModifierKey from 'components/smart/ModifierKey';

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
			document.body.removeEventListener = (listener) => {
				wasKeyDownHandlerRemoved = wasKeyDownHandlerRemoved || listener === 'keydown';
				wasKeyUpHandlerRemoved = wasKeyUpHandlerRemoved || listener === 'keyup';
			}
			modifierKeyComponent.componentWillUnmount();
			expect(wasKeyDownHandlerRemoved).to.be.true;
			expect(wasKeyUpHandlerRemoved).to.be.true;
		})
	})
})
