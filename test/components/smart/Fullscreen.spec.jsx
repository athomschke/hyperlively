import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Fullscreen from 'components/smart/Fullscreen';

class MockedSubComponent extends React.Component {

	static propTypes = {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired
	};

	render () {
		return <div></div>;
	}
}

const MockedComponent = Fullscreen(MockedSubComponent);

describe('Fullscreen', () => {
	describe('resizes', () => {

		let restorableWidth;
		let restorableHeight;
		let fullscreenComponent;
		let oldRemoveEventListener;

		beforeEach(() => {
			restorableWidth = window.innerWidth;
			restorableHeight = window.innerHeight;
			fullscreenComponent = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
			oldRemoveEventListener = window.removeEventListener;
		});

		afterEach(() => {
			window.innerWidth = restorableWidth;
			window.innerHeight = restorableHeight;
			window.removeEventListener = oldRemoveEventListener;
		});

		it('to window size when created', () => {
			expect(fullscreenComponent.state.width).to.equal(window.innerWidth);
			expect(fullscreenComponent.state.height).to.equal(window.innerHeight);
		});

		it('with the window', () => {
			window.innerWidth = 100;
			window.innerHeight = 100;
			fullscreenComponent.handleResize();
			expect(fullscreenComponent.state.width).to.equal(100);
			expect(fullscreenComponent.state.height).to.equal(100);
		});

		it('not any more when removed', () => {
			let wasResizeHandlerRemoved = false;
			window.removeEventListener = (listener) => {
				wasResizeHandlerRemoved = wasResizeHandlerRemoved || listener === 'resize';
			};
			fullscreenComponent.componentWillUnmount();
			expect(wasResizeHandlerRemoved).to.be.true;
		});
	});
});
