// @flow
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { point } from 'src/client/app/helpers.spec';
import TimeoutBehavior from 'src/client/app/components/TimeoutBehavior';

import TimelinePreview from './TimelinePreview';
import Timeline from './Timeline';

const MyTimeline = TimeoutBehavior(Timeline);

const mockSketches = [{
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
}];


const renderComponentWithSketches = sketches => TestUtils.renderIntoDocument(<MyTimeline
	max={100}
	value={99}
	sketches={sketches}
/>);

describe('Timeline', () => {
	describe('rendering the timeline', () => {
		it('shows a preview canvas for every sketch handed to it', () => {
			const temporaryCallbackSlider = renderComponentWithSketches(mockSketches);
			const canvasses = TestUtils.scryRenderedDOMComponentsWithTag(temporaryCallbackSlider, 'canvas');
			expect(canvasses).to.have.length(3);
		});
	});

	describe('Selecting a canvas in the TimelinePreview', () => {
		it('calls onSelectStokes property on Timeline', () => {
			const onSelectStokes = stub();
			const wrapper = mount(<MyTimeline
				onSelectStokes={onSelectStokes}
				sketches={mockSketches}
			/>);
			wrapper.find(TimelinePreview).at(0).prop('onSelect')();
			expect(onSelectStokes.callCount).to.equal(1);
		});
	});
});
