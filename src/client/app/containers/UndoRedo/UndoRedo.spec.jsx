// @flow
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import Slider from 'rc-slider';
import TestUtils from 'react-addons-test-utils';

import UndoRedo, { type UndoRedoSliderProps } from './UndoRedo';

const defaultProps = () => ({
	max: 100,
	disabled: false,
	timeout: 100,
	onChange: () => undefined,
	temporaryCallback: () => undefined,
	value: 1,
	callbackEnabled: true,
});

const renderComponentWithValueAndMax = (value, max) => TestUtils.renderIntoDocument(<UndoRedo
	max={max}
	disabled={false}
	timeout={100}
	onChange={() => undefined}
	temporaryCallback={() => undefined}
	value={value}
	callbackEnabled
/>);

const renderComponentWithProps =
	(props: UndoRedoSliderProps) => TestUtils.renderIntoDocument(<UndoRedo {...props} />);

describe('Undo Redo', () => {
	it('is smaller than the window size', () => {
		const appConfigurationWrapper = mount(<UndoRedo {...defaultProps()} />);
		expect(appConfigurationWrapper.find('div').at(0).getNode().offsetWidth < window.innerWidth).to.be.true();
	});

	describe('rendering the slider', () => {
		it('disables Slider when timeline is disabled', () => {
			const temporaryCallbackSlider = renderComponentWithProps({
				...defaultProps(),
				disabled: true,
			});
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			expect(slider.props.disabled).to.be.true();
		});

		it('enables Slider when max is larger than 0', () => {
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={4}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			expect(slider.props.disabled).to.be.false();
		});
	});

	describe('moving the slider handle right', () => {
		it('calls callback with new value', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={4}
				onChange={(value) => { argument = value; }}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(5);
			expect(argument).to.equal(5);
		});

		it('sets to max value when clicking end of slider', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(10);
			expect(argument).to.equal(10);
		});

		it('sets to max value when clicking behind end of slider', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(11);
			expect(argument).to.equal(10);
		});

		it('Does nothing on redo when initialized without a redo callback', () => {
			const temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(5);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});
	});

	describe('moving the slider handle left', () => {
		it('can set value from 5 to 4 in plain mode', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('can set value from 5 to 4 in Ploma mode', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<UndoRedo
				{...defaultProps()}
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('Does nothing when initialized without an undo callback', () => {
			const temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			slider.props.onChange(8);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});
	});
});
