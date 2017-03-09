import TestUtils from 'react-addons-test-utils';
import React from 'react';
import TimeoutBehavior from 'components/smart/TimeoutBehavior';

let calledWithProps;

const Wrapped = (props) => {
	calledWithProps = props;
	return <div />;
};

const WrappedWithTimeoutBehavior = TimeoutBehavior(Wrapped);

describe('WrappedWithTimeoutBehavior', () => {
	beforeEach(() => {
		calledWithProps = null;
	});

	describe('moving the slider handle left', () => {
		it('temporarily disables ploma when callback given', () => {
			let argument = true;
			TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled
				temporaryCallback={(value) => { argument = value; }}
			/>);
			calledWithProps.onChange(4);
			expect(argument).to.equal(false);
		});

		it('Does nothing when initialized without a temporaryCallback callback', () => {
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled
			/>);
			temporaryCallbackSlider.beActive();
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

		it('does nothing if not changing the value', () => {
			let changed = false;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled
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
				max={10}
				value={9}
				callbackEnabled
			/>);
			sinon.spy(temporaryCallbackSlider, 'setState');
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
						max={10}
						value={5}
						callbackEnabled
						timeout={1}
						temporaryCallback={() => { resolve(); }}
					/>);
					temporaryCallbackSlider.beActive();
				},
			))
			.then(done)
			.catch((error) => {
				expect(false).to.be.true();
				throw (error);
			});
		});
	});

	describe('releasing the slider handle', () => {
		it('restores ploma', () => {
			let argument = true;
			TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled
				temporaryCallback={(value) => { argument = value; }}
			/>);
			calledWithProps.onChange(4);
			calledWithProps.afterChange();
			expect(argument).to.equal(true);
		});

		it('does nothing if not grabbed before', () => {
			let argument = true;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				temporaryCallback={(value) => { argument = value; }}
			/>);
			temporaryCallbackSlider.beNotActive(4);
			expect(argument).to.equal(true);
		});
	});
});
