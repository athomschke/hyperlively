import TimeoutBehavior from 'components/smart/TimeoutBehavior';
import TestUtils from 'react-addons-test-utils';
import React, { Component } from 'react';

class Wrapped extends Component {
	render() {
		return (<div />);	
	}
}

let WrappedWithTimeoutBehavior = TimeoutBehavior(Wrapped);

describe('WrappedWithTimeoutBehavior', () => {

	describe('moving the slider handle left', () => {

		it('temporarily disables ploma when callback given', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled={true}
				temporaryCallback={(value) => { argument = value; }}
			></WrappedWithTimeoutBehavior>);
			temporaryCallbackSlider.refs.wrapped.props.onChange(4);
			expect(argument).to.equal(false);
		});

		it('Does nothing when initialized without a temporaryCallback callback', () => {
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled={true}
			></WrappedWithTimeoutBehavior>);
			temporaryCallbackSlider.beActive();
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

	});

	describe('hovering after dragging', () => {
		it('restores state after the custom timeout', (done) => {
			(new Promise(
				function(resolve) {
					let temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
						max={10}
						value={5}
						callbackEnabled={true}
						timeout={1}
						temporaryCallback={() => { resolve(); }}
					></WrappedWithTimeoutBehavior>);
					temporaryCallbackSlider.beActive();
				}
			))
			.then(done)
			.catch(function(error) {
				expect(false).to.be.true;
				throw(error);
			});
		});
	});

	describe('releasing the slider handle', () => {

		it('restores ploma', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				callbackEnabled={true}
				temporaryCallback={(value) => { argument = value; }}
			></WrappedWithTimeoutBehavior>);
			temporaryCallbackSlider.refs.wrapped.props.onChange(4);
			temporaryCallbackSlider.refs.wrapped.props.afterChange();
			expect(argument).to.equal(true);
		});

		it('does nothing if not grabbed before', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<WrappedWithTimeoutBehavior
				max={10}
				value={9}
				temporaryCallback={(value) => { argument = value; }}
			></WrappedWithTimeoutBehavior>);
			temporaryCallbackSlider.beNotActive (4);
			expect(argument).to.equal(true);
		});
		
	});
	
});