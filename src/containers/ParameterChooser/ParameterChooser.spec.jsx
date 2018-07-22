// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow, type ShallowWrapper } from 'enzyme';

import { stroke } from 'src/reducers/data/strokes/stroke';
import type { Stroke, RecognitionState, TextCandidateState } from 'src/types';

import PrefixedJSONPropertyChooser from './PrefixedJSONPropertyChooser';
import ParameterChooser, { type ParameterChooserProps } from './ParameterChooser';

const dummyStroke = (): Stroke => ({
	...stroke(undefined, { type: '' }),
	points: [{
		x: 0,
		y: 0,
		timeStamp: 100,
	}, {
		x: 0,
		y: 10,
		timeStamp: 102,
	}],
	selected: true,
	finished: true,
});

const defaultProps = (): ParameterChooserProps => ({
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onExpandedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	expandedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

const shallowWithProps = (props: ParameterChooserProps) => shallow(<ParameterChooser {...props} />);
const selectedStrokesChooser = (
	parameterChooser: ShallowWrapper,
) => parameterChooser.find(PrefixedJSONPropertyChooser).findWhere(n => n.prop('prefix') === 'selectedStrokes');

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders two prefixed json property choosers', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const jsonPropertyChooser = parameterChooser.find(PrefixedJSONPropertyChooser);
			expect(jsonPropertyChooser).to.have.length(2);
		});

		it('renders a selected stroke chooser', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });

			expect(selectedStrokesChooser(parameterChooser).length).to.equal(1);
		});

		it('renders an interpretation chooser', () => {
			const text: TextCandidateState = {
				strokeIds: [],
				candidate: {
					label: 'a',
					normalizedScore: 1,
					resemblanceScore: 1,
				},
			};
			const interpretation: RecognitionState = {
				texts: [text],
				shapes: [],
			};
			const parameterChooser = shallowWithProps({ ...defaultProps(), interpretation });

			const interpretationsChooser = parameterChooser
				.find(PrefixedJSONPropertyChooser)
				.findWhere(n => n.prop('prefix') === 'interpretation');

			expect(interpretationsChooser.length).to.equal(1);
		});
	});
});
