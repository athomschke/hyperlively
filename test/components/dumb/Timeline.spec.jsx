import Slider from 'rc-slider';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import TimelineView from 'components/dumb/Timeline';
import TimeoutBehavior from 'components/smart/TimeoutBehavior';
import { point } from '../../helpers';

const Timeline = TimeoutBehavior(TimelineView);

const renderComponentWithValueAndMax = (value, max) => TestUtils.renderIntoDocument(<Timeline
	max={max}
	value={value}
/>);

const renderComponentWithSketches = sketches => TestUtils.renderIntoDocument(<Timeline
	max={100}
	value={99}
	sketches={sketches}
/>);

const renderComponentWithProps = props => TestUtils.renderIntoDocument(<Timeline {...props} />);

describe('Timeline', () => {
	describe('rendering the slider', () => {
		it('disables Slider when timeline is disabled', () => {
			const temporaryCallbackSlider = renderComponentWithProps({
				disabled: true,
			});
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			expect(slider.props.disabled).to.be.true();
		});

		it('enables Slider when max is larger than 0', () => {
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
				max={10}
				value={4}
			/>);
			const slider = TestUtils.scryRenderedComponentsWithType(temporaryCallbackSlider, Slider)[0];
			expect(slider.props.disabled).to.be.false();
		});

		it('shows a preview canvas for every sketch handed to it', () => {
			const temporaryCallbackSlider = renderComponentWithSketches([{
				strokes: [{
					points: [point(12, 12), point(11, 11), point(10, 10)],
					actionIndex: 0,
				}],
			}, {
				strokes: [{
					points: [point(20, 20), point(21, 21), point(22, 22)],
					actionIndex: 3,
				}],
			}, {
				strokes: [{
					points: [point(30, 30), point(31, 31), point(32, 32)],
					actionIndex: 6,
				}],
			}]);
			const canvasses = TestUtils.scryRenderedDOMComponentsWithTag(temporaryCallbackSlider, 'canvas');
			expect(canvasses).to.have.length(3);
		});
	});

	describe('moving the slider handle right', () => {
		it('calls callback with new value', () => {
			let argument;
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
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
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
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
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
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
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
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
			const temporaryCallbackSlider = TestUtils.renderIntoDocument(<Timeline
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
