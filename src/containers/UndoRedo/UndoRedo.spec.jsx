// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import React from 'react';

import UndoRedo from './UndoRedo';
import UndoRedoSlider, { type UndoRedoSliderProps } from './UndoRedoSlider';

const defaultProps = () => ({
	max: 100,
	disabled: false,
	timeout: 100,
	onChange: () => undefined,
	temporaryCallback: () => undefined,
	value: 1,
	callbackEnabled: true,
});

const renderWithProps = (props: UndoRedoSliderProps) => shallow(<UndoRedo {...props} />);

describe('Undo Redo', () => {
	describe('rendering the slider', () => {
		it('disables Slider when timeline is disabled', () => {
			const temporaryCallbackSlider = renderWithProps({
				...defaultProps(),
				disabled: true,
			});
			const slider = temporaryCallbackSlider.find(UndoRedoSlider);
			expect(slider.prop('disabled')).to.be.true();
		});

		it('enables Slider when max is larger than 0', () => {
			const temporaryCallbackSlider = renderWithProps({
				...defaultProps(),
				max: 10,
				value: 4,
			});
			const slider = temporaryCallbackSlider.find(UndoRedoSlider);
			expect(slider.prop('disabled')).to.be.false();
		});
	});

	describe('moving the slider handle right', () => {
		it('calls callback with new value', () => {
			const max = 10;
			const value = 4;
			const onChange = spy();
			const temporaryCallbackSlider = renderWithProps({
				...defaultProps(), max, value, onChange,
			});
			const slider = temporaryCallbackSlider.find(UndoRedoSlider);
			slider.prop('onChange')(5);
			expect(onChange.args[0][0]).to.equal(5);
		});

		it('sets to max value when clicking end of slider', () => {
			const max = 10;
			const value = 9;
			const onChange = spy();
			const temporaryCallbackSlider = renderWithProps({
				...defaultProps(), max, value, onChange,
			});
			const slider = temporaryCallbackSlider.find(UndoRedoSlider);
			slider.prop('onChange')(10);
			expect(onChange.args[0][0]).to.equal(10);
		});
	});

	describe('moving the slider handle left', () => {
		it('can set value from 5 to 4 in plain mode', () => {
			const max = 10;
			const value = 9;
			const onChange = spy();
			const temporaryCallbackSlider = renderWithProps({
				...defaultProps(), max, value, onChange,
			});
			const slider = temporaryCallbackSlider.find(UndoRedoSlider);
			slider.prop('onChange')(4);
			expect(onChange.args[0][0]).to.equal(4);
		});
	});
});
