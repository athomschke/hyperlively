// @flow
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';

import TimeoutBehavior, { type TimeoutBehaviorProps } from '.';

type WrappedWithTimeoutBehaviorProps = {
	temporaryCallback: (_value: any) => void,
}

const defaultProps = (): TimeoutBehaviorProps<WrappedWithTimeoutBehaviorProps> => ({
	max: 10,
	value: 9,
	callbackEnabled: true,
	disabled: false,
	onChange: () => undefined,
	timeout: 1,
	temporaryCallback: (_bool: any) => {},
});

const Wrapped = () => <div />;
const WrappedWithTimeoutBehavior = TimeoutBehavior(Wrapped);

const renderComponentWithProps = (props: TimeoutBehaviorProps<WrappedWithTimeoutBehaviorProps>) => mount(<WrappedWithTimeoutBehavior {...props} />);

describe('WrappedWithTimeoutBehavior', () => {
	describe('moving the slider handle left', () => {
		it('temporarily disables ploma when callback given', () => {
			const temporaryCallback = spy();
			const wrapper = renderComponentWithProps({ ...defaultProps(), temporaryCallback });
			wrapper.find(Wrapped).prop('onChange')(4);
			expect(temporaryCallback.args[0][0]).to.equal(false);
		});

		it('Does nothing when initialized without a temporaryCallback callback', () => {
			const temporaryCallbackSlider = renderComponentWithProps(defaultProps());
			temporaryCallbackSlider.instance().beActive();
			expect(temporaryCallbackSlider.prop('value')).to.equal(9);
		});

		it('does nothing if not changing the value', () => {
			const onChange = spy();
			const temporaryCallbackSlider = renderComponentWithProps({ ...defaultProps(), onChange });
			temporaryCallbackSlider.instance().beActive(9);
			expect(onChange.callCount).to.equal(0);
		});
	});

	describe('Resetting the state', () => {
		it('works when no disable function is given', () => {
			const temporaryCallbackSlider = renderComponentWithProps(defaultProps());
			temporaryCallbackSlider.instance().beActive();
			expect(temporaryCallbackSlider.prop('value')).to.equal(9);
			spy(temporaryCallbackSlider.instance(), 'setState');
			temporaryCallbackSlider.instance().resetState();
			expect(temporaryCallbackSlider.instance().setState.callCount).to.equal(1);
			temporaryCallbackSlider.instance().setState.restore();
		});
	});

	describe('hovering after dragging', () => {
		it('restores state after the custom timeout', (done) => {
			(new Promise(
				(resolve) => {
					const value = 5;
					const temporaryCallback = () => { resolve(); };
					const temporaryCallbackSlider = renderComponentWithProps({
						...defaultProps(),
						value,
						temporaryCallback,
					});
					temporaryCallbackSlider.instance().beActive();
				},
			)).then(done).catch((error) => {
				expect(false).to.be.true();
				throw (error);
			});
		});
	});

	describe('releasing the slider handle', () => {
		it('restores ploma', () => {
			const temporaryCallback = spy();
			const temporaryCallbackSlider = renderComponentWithProps({
				...defaultProps(),
				temporaryCallback,
			});
			temporaryCallbackSlider.find(Wrapped).prop('onChange')(4);
			temporaryCallbackSlider.find(Wrapped).prop('afterChange')();
			expect(temporaryCallback.args[1][0]).to.be.true();
		});

		it('does nothing if not grabbed before', () => {
			const temporaryCallback = spy();
			const temporaryCallbackSlider = renderComponentWithProps({
				...defaultProps(),
				temporaryCallback,
			});
			temporaryCallbackSlider.instance().beNotActive(4);
			expect(temporaryCallback.callCount).to.equal(0);
		});
	});
});
