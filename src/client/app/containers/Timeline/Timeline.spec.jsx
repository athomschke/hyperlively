// @flow
import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { point } from 'src/client/app/helpers.spec';
import type { Sketch, Stroke } from 'src/client/app/types';

import TimelinePreview from './TimelinePreview';
import Timeline, { type TimelineProps } from './Timeline';

const MyTimeline = Timeline;

const mockSketches: Array<Sketch> = [{
	strokes: [{
		points: [point(12, 12), point(11, 11), point(10, 10)],
		color: 'rgb(0, 0, 0)',
		angle: 0,
		center: { x: 12, y: 12 },
		finished: true,
		hidden: false,
		selected: false,
		position: { x: 12, y: 12 },
		actionIndex: 0,
	}],
	finished: true,
}, {
	strokes: [{
		points: [point(20, 20), point(21, 21), point(22, 22)],
		color: 'rgb(0, 0, 0)',
		angle: 0,
		center: { x: 12, y: 12 },
		finished: true,
		hidden: false,
		selected: false,
		position: { x: 12, y: 12 },
		actionIndex: 3,
	}],
	finished: true,
}, {
	strokes: [{
		points: [point(30, 30), point(31, 31), point(32, 32)],
		color: 'rgb(0, 0, 0)',
		angle: 0,
		center: { x: 12, y: 12 },
		finished: true,
		hidden: false,
		selected: false,
		position: { x: 12, y: 12 },
		actionIndex: 6,
	}],
	finished: true,
}];

const myTimelineProps = (sketches: Array<Sketch>): TimelineProps => ({
	max: 100,
	callbackEnabled: true,
	temporaryCallback: (_value: any) => {},
	onSelectStokes: (_strokes: Array<Stroke>) => {},
	timeout: 1,
	disabled: false,
	value: 99,
	sketches,
});

const renderComponentWithSketches = (sketches: Array<Sketch>) =>
	TestUtils.renderIntoDocument(<MyTimeline {...myTimelineProps(sketches)} />);

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
