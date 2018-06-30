// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import React, { type ComponentType } from 'react';
import { spy, stub } from 'sinon';

import TimeoutBehavior, { type TimeoutBehaviorProps } from 'src/client/app/containers/UndoRedo/TimeoutBehavior';

const defaultProps = (): TimeoutBehaviorProps => ({
	max: 10,
	value: 9,
	callbackEnabled: true,
	disabled: false,
	onChange: () => undefined,
	timeout: 1,
	temporaryCallback: stub(),
});

describe('WrappedWithTimeoutBehavior', () => {
	let Wrapped: Function;
	let WrappedWithTimeoutBehavior: ComponentType<TimeoutBehaviorProps>;

	beforeEach(() => {
		Wrapped = stub();
		Wrapped.returns(<div />);
		WrappedWithTimeoutBehavior = TimeoutBehavior(Wrapped);
	});

	describe('moving the slider handle left', () => {
		it('temporarily disables ploma when callback given', () => {
			let argument = true;
			TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
				temporaryCallback={(value) => { argument = value; }}
			/>);
			const wrappedProps = Wrapped.args[0][0];
			wrappedProps.onChange(4);
			expect(argument).to.equal(false);
		});

		it('Does nothing when initialized without a temporaryCallback callback', () => {
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
			/>);
			temporaryCallbackSlider.beActive();
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

		it('does nothing if not changing the value', () => {
			let changed = false;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
				onChange={() => {
					changed = true;
				}}
			/>);
			temporaryCallbackSlider.beActive(9);
			expect(changed).to.be.false();
		});
	});

	describe('Resetting the state', () => {
		it('works when no disable function is given', () => {
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
			/>);
			spy(temporaryCallbackSlider, 'setState');
			temporaryCallbackSlider.resetState();
			expect(temporaryCallbackSlider.setState.callCount).to.equal(1);
			temporaryCallbackSlider.setState.restore();
		});
	});

	describe('hovering after dragging', () => {
		it('restores state after the custom timeout', (done) => {
			(new Promise(
				(resolve) => {
					const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
						{...defaultProps()}
						value={5}
						temporaryCallback={() => { resolve(); }}
					/>);
					temporaryCallbackSlider.beActive();
				},
			)).then(done).catch((error) => {
				expect(false).to.be.true();
				throw (error);
			});
		});
	});

	describe('releasing the slider handle', () => {
		it('restores ploma', () => {
			let argument = true;
			TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
				temporaryCallback={(value) => { argument = value; }}
			/>);
			const wrappedProps = Wrapped.args[0][0];
			wrappedProps.onChange(4);
			wrappedProps.afterChange();
			expect(argument).to.equal(true);
		});

		it('does nothing if not grabbed before', () => {
			let argument = true;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				{...defaultProps()}
				temporaryCallback={(value) => { argument = value; }}
			/>);
			temporaryCallbackSlider.beNotActive(4);
			expect(argument).to.equal(true);
		});
	});
});
