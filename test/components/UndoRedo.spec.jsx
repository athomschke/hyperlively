import UndoRedo from 'components/UndoRedo';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

let renderComponentWithValueAndMax = (value, max) => {
	return TestUtils.renderIntoDocument(<UndoRedo
		max={max}
		value={value}
	></UndoRedo>)
}

describe('UndoRedo', () => {
	it('disables Undo Button when first value is set', () => {
		let undoRedo = renderComponentWithValueAndMax(0, 10)
		expect(undoRedo.refs.undo.disabled).to.be.true;
	})

	it('enables Undo Button when second value is set', () => {
		let undoRedo = renderComponentWithValueAndMax(1, 10)
		expect(undoRedo.refs.undo.disabled).to.be.false;
	})
	
	it('disables Redo Button when last value is set', () => {
		let undoRedo = renderComponentWithValueAndMax(10, 10)
		expect(undoRedo.refs.redo.disabled).to.be.true;
	})
	
	it('enables Redo Button when second to last value is set', () => {
		let undoRedo = renderComponentWithValueAndMax(9, 10)
		expect(undoRedo.refs.redo.disabled).to.be.false;
	})
	
	it('disables Slider when max is 0', () => {
		let undoRedo = renderComponentWithValueAndMax(0, 0)
		expect(undoRedo.refs.slider.props.disabled).to.be.true;
	})
	
	it('enables Slider when max is larger than 0', () => {
		let undoRedo = renderComponentWithValueAndMax(0, 1)
		expect(undoRedo.refs.slider.props.disabled).to.be.false;
	})

	it('sets value to 4 when undoing on 5', () => {
		let argument;
		let undoRedo = TestUtils.renderIntoDocument(<UndoRedo
			max={10}
			value={5}
			jumpToPast={(value) => { argument = value }}
		></UndoRedo>)
		undoRedo.refs.slider.props.onChange(4);
		expect(argument).to.equal(4);
	})

	it('goes 1 into the future when redoing on 4', () => {
		let argument;
		let undoRedo = TestUtils.renderIntoDocument(<UndoRedo
			max={10}
			value={4}
			jumpToFuture={(value) => { argument = value }}
		></UndoRedo>)
		undoRedo.refs.slider.props.onChange(5);
		expect(argument).to.equal(1);
	})

	it('sets to final state when clicking end of slider', () => {
		let argument;
		let undoRedo = TestUtils.renderIntoDocument(<UndoRedo
			max={10}
			value={9}
			jumpToFuture={(value) => { argument = value }}
		></UndoRedo>)
		undoRedo.refs.slider.props.onChange(10);
		expect(argument).to.equal(1);
	})
})