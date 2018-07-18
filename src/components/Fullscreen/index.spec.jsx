// @flow
import jsdom from 'jsdom-global';
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';

import Fullscreen from '.';

type MockedSubComponentProps = {
	width: number,
	height: number,
}

const MockedSubComponent = (
	{ width, height }: MockedSubComponentProps,
) => <div width={width} height={height} />;

const MockedComponent = Fullscreen(MockedSubComponent);

describe('Fullscreen', () => {
	let cleanup;

	beforeEach(() => {
		cleanup = jsdom();
	});

	afterEach(() => {
		cleanup();
	});

	describe('resizes', () => {
		let restorableWidth;
		let restorableHeight;
		let fullscreenComponent;
		let oldRemoveEventListener;

		beforeEach(() => {
			restorableWidth = window.innerWidth;
			restorableHeight = window.innerHeight;
			fullscreenComponent = mount(<MockedComponent />);
			oldRemoveEventListener = window.removeEventListener;
		});

		afterEach(() => {
			window.innerWidth = restorableWidth;
			window.innerHeight = restorableHeight;
			window.removeEventListener = oldRemoveEventListener;
		});

		it('to window size when created', () => {
			expect(fullscreenComponent.state('width')).to.equal(window.innerWidth);
			expect(fullscreenComponent.state('height')).to.equal(window.innerHeight);
		});

		it('with the window', () => {
			window.innerWidth = 100;
			window.innerHeight = 100;
			fullscreenComponent.instance().handleResize();
			expect(fullscreenComponent.state('width')).to.equal(100);
			expect(fullscreenComponent.state('height')).to.equal(100);
		});

		it('not any more when removed', () => {
			let wasResizeHandlerRemoved = false;
			window.removeEventListener = (listener) => {
				wasResizeHandlerRemoved = wasResizeHandlerRemoved || listener === 'resize';
			};
			fullscreenComponent.instance().componentWillUnmount();
			expect(wasResizeHandlerRemoved).to.be.true();
		});
	});
});
