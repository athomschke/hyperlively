import TemporaryCallbackSlider from 'components/smart/TemporaryCallbackSlider';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

let renderComponentWithValueAndMax = (value, max) => {
	return TestUtils.renderIntoDocument(<TemporaryCallbackSlider
		max={max}
		value={value}
	></TemporaryCallbackSlider>)
}

describe('TemporaryCallbackSlider', () => {

	describe('rendering the slider', () => {

		it('disables Slider when max is 0', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(0, 0)
			expect(temporaryCallbackSlider.refs.slider.props.disabled).to.be.true;
		})
		
		it('enables Slider when max is larger than 0', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(0, 1)
			expect(temporaryCallbackSlider.refs.slider.props.disabled).to.be.false;
		})
		
	})

	describe('moving the slider handle right', () => {

		it('calls callback with new value', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={4}
				onChange={(value) => { argument = value }}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(5);
			expect(argument).to.equal(5);
		})

		it('sets to max value when clicking end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={9}
				onChange={(value) => { argument = value }}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(10);
			expect(argument).to.equal(10);
		})

		it('sets to max value when clicking behind end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={9}
				onChange={(value) => { argument = value }}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(11);
			expect(argument).to.equal(10);
		})

		it('Does nothing on redo when initialized without a redo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.refs.slider.props.onChange(5);
			expect(temporaryCallbackSlider.props.value).to.equal(9)
		})
		
	})

	describe('moving the slider handle left', () => {

		it('can set value from 5 to 4 in plain mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={5}
				onChange={(value) => { argument = value }}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		})

		it('can set value from 5 to 4 in Ploma mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={5}
				onChange={(value) => { argument = value }}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		})

		it('temporarily disables ploma when callback given', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={9}
				temporaryCallback={(value) => {argument = value}}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			expect(argument).to.equal(false);
		})

		it('Does nothing when initialized without an undo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.onSliderMove(8);
			expect(temporaryCallbackSlider.props.value).to.equal(9)
		})

	})

	describe('releasing the slider handle', () => {

		it('restores ploma', () => {
			let argument = true;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<TemporaryCallbackSlider
				max={10}
				value={9}
				temporaryCallback={(value) => {argument = value}}
			></TemporaryCallbackSlider>)
			temporaryCallbackSlider.refs.slider.props.onChange(4);
			temporaryCallbackSlider.refs.slider.props.afterChange();
			expect(argument).to.equal(true);
		})
		
	})
	
})