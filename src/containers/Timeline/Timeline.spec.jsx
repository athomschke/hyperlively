// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import { point } from 'src/helpers.spec';
import { stroke } from 'src/reducers/data/strokes/stroke';
import type { Sketch, Stroke } from 'src/types';

import TimelinePreview from './TimelinePreview';
import Timeline, { type TimelineProps } from './Timeline';

const sketches: Array<Sketch> = [{
	strokes: [{
		...stroke(undefined, { type: '' }),
		points: [point(12, 12), point(11, 11), point(10, 10)],
		center: { x: 12, y: 12 },
		finished: true,
		position: { x: 12, y: 12 },
	}],
	finished: true,
}, {
	strokes: [{
		...stroke(undefined, { type: '' }),
		points: [point(20, 20), point(21, 21), point(22, 22)],
		center: { x: 12, y: 12 },
		finished: true,
		position: { x: 12, y: 12 },
		actionIndex: 3,
	}],
	finished: true,
}, {
	strokes: [{
		...stroke(undefined, { type: '' }),
		points: [point(30, 30), point(31, 31), point(32, 32)],
		center: { x: 12, y: 12 },
		finished: true,
		position: { x: 12, y: 12 },
		actionIndex: 6,
	}],
	finished: true,
}];

const defaultProps = () => ({
	max: 100,
	callbackEnabled: true,
	temporaryCallback: (_value: any) => {},
	onSelectStokes: (_strokes: Array<Stroke>) => {},
	timeout: 1,
	disabled: false,
	value: 99,
	sketches,
});

const renderComponentWithProps = (props: TimelineProps) => shallow(<Timeline {...props} />);

describe('Timeline', () => {
	describe('rendering the timeline', () => {
		it('shows a preview canvas for every sketch handed to it', () => {
			const temporaryCallbackSlider = renderComponentWithProps({ ...defaultProps() });

			expect(temporaryCallbackSlider.find(TimelinePreview)).to.have.length(3);
		});
	});

	describe('Selecting a canvas in the TimelinePreview', () => {
		it('calls onSelectStokes property on Timeline', () => {
			const onSelectStokes = spy();
			const wrapper = renderComponentWithProps({ ...defaultProps(), onSelectStokes });

			wrapper.find(TimelinePreview).at(0).prop('onSelect')();

			expect(onSelectStokes.callCount).to.equal(1);
		});
	});
});
