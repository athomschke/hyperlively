import TimelineView from 'components/dumb/Timeline';
import TimeoutBehavior from 'components/smart/TimeoutBehavior';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';

let Timeline = TimeoutBehavior(TimelineView);

let renderComponentWithValueAndMax = (value, max) => {
	return TestUtils.renderIntoDocument(<Timeline
		max={max}
		value={value}
	></Timeline>);
};

let renderComponentWithSketches = (sketches) => {
	return TestUtils.renderIntoDocument(<Timeline
		max={100}
		value={99}
		sketches={sketches}
	></Timeline>);
};

describe('Timeline', () => {

	describe('rendering the slider', () => {

		it('disables Slider when max is 0', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(0, 0);
			expect(temporaryCallbackSlider.refs.wrapped.refs.slider.props.disabled).to.be.true;
		});
		
		it('enables Slider when max is larger than 0', () => {
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={4}

			></Timeline>);
			expect(temporaryCallbackSlider.refs.wrapped.refs.slider.props.disabled).to.be.false;
		});

		it('shows a preview canvas for every sketch handed to it', () => {
			let temporaryCallbackSlider = renderComponentWithSketches([{
				strokes: [{
					points: [point(12,12), point(11,11), point(10,10)],
					actionIndex: 0
				}]
			}, {
				strokes: [{
					points: [point(20,20), point(21,21), point(22,22)],
					actionIndex: 3
				}]
			}, {
				strokes: [{
					points: [point(30,30), point(31,31), point(32,32)],
					actionIndex: 6
				}]
			}]);
			expect(temporaryCallbackSlider.refs.wrapped.refs.previewContainer.children).to.have.length(3);
			let canvasses = TestUtils.scryRenderedDOMComponentsWithTag(temporaryCallbackSlider, 'canvas');
			expect(canvasses).to.have.length(3);
		});
		
	});

	describe('moving the slider handle right', () => {

		it('calls callback with new value', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={4}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(5);
			expect(argument).to.equal(5);
		});

		it('sets to max value when clicking end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(10);
			expect(argument).to.equal(10);
		});

		it('sets to max value when clicking behind end of slider', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={9}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(11);
			expect(argument).to.equal(10);
		});

		it('Does nothing on redo when initialized without a redo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(5);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});
		
	});

	describe('moving the slider handle left', () => {

		it('can set value from 5 to 4 in plain mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('can set value from 5 to 4 in Ploma mode', () => {
			let argument;
			let temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={5}
				onChange={(value) => { argument = value; }}
			></Timeline>);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(4);
			expect(argument).to.equal(4);
		});

		it('Does nothing when initialized without an undo callback', () => {
			let temporaryCallbackSlider = renderComponentWithValueAndMax(9, 10);
			temporaryCallbackSlider.refs.wrapped.refs.slider.props.onChange(8);
			expect(temporaryCallbackSlider.props.value).to.equal(9);
		});

	});
	
});