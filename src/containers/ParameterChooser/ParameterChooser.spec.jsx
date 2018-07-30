// @flow
import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';

import { stroke } from 'src/reducers/data/strokes/stroke';
import type {
	Stroke, RecognitionState, TextCandidateState, ShapeCandidateState,
} from 'src/types';

import PrefixedJSONPropertyChooser from './PrefixedJSONPropertyChooser';
import ParameterChooser, { type ParameterChooserProps } from './ParameterChooser';

const defaultProps = (): ParameterChooserProps => ({
	strokes: [],
	parameters: [],
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onExpandedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	expandedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

const STROKE_ID = 123;

const dummyStroke = (): Stroke => ({
	...stroke(undefined, { type: '' }),
	id: STROKE_ID,
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

const shallowWithProps = (props: ParameterChooserProps) => shallow(<ParameterChooser {...props} />);

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders no prefixed json property choosers per defult', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const jsonPropertyChooser = parameterChooser.find(PrefixedJSONPropertyChooser);

			expect(jsonPropertyChooser).to.have.length(0);
		});
	});

	describe('Drawing a stroke', () => {
		it('renders a selected stroke chooser', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });
			const selectedStrokesChooser = parameterChooser.find(PrefixedJSONPropertyChooser).findWhere(
				n => n.prop('prefixes')[0] === 'selectedStrokes',
			);

			expect(selectedStrokesChooser).to.have.length(1);
		});

		it('puts the selected stroke chooser into the middle of the strokes', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });
			const selectedStrokesChooser = parameterChooser.find(PrefixedJSONPropertyChooser).findWhere(
				n => n.prop('prefixes')[0] === 'selectedStrokes',
			);
			const positioner = parameterChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(selectedStrokesChooser.prop('position')).to.equal(null);
			expect(positioner.prop('style').left).to.equal(0);
			expect(positioner.prop('style').top).to.equal(5);
		});
	});

	describe('Recognizing a shape', () => {
		const dummyShape = (): ShapeCandidateState => ({
			strokeIds: [STROKE_ID],
			candidate: {
				type: 'recognizedShape',
				label: 'arrow',
				primitives: [{
					type: 'line',
					firstPoint: { x: 0, y: 100 },
					lastPoint: { x: 100, y: 100 },
					beginDecoration: 'none',
					endDecoration: 'arrow',
					beginTangentAngle: 0,
					endTangentAngle: 0,
				}],
				normalizedRecognitionScore: 1,
				resemblanceScore: 1,
			},
		});

		it('renders a shapes interpretation chooser', () => {
			const interpretation: RecognitionState = { texts: [], shapes: [dummyShape()] };
			const parameterChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = parameterChooser
				.find(PrefixedJSONPropertyChooser)
				.findWhere(n => n.prop('prefixes')[0] === 'interpretation' && n.prop('prefixes')[1] === 'shapes');

			expect(interpretationsChooser.length).to.equal(1);
		});

		it('puts the shapes interpretation chooser into the middle of the shapes stroke', () => {
			const interpretation: RecognitionState = { texts: [], shapes: [dummyShape()] };
			const parameterChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = parameterChooser
				.find(PrefixedJSONPropertyChooser)
				.findWhere(n => n.prop('prefixes')[0] === 'interpretation' && n.prop('prefixes')[1] === 'shapes');
			const positioner = parameterChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(interpretationsChooser.prop('position')).to.equal(null);
			expect(positioner.prop('style').left).to.equal(0);
			expect(positioner.prop('style').top).to.equal(5);
		});
	});

	describe('Recognizing a text', () => {
		const dummyText = (): TextCandidateState => ({
			strokeIds: [STROKE_ID],
			candidate: {
				label: 'a',
				normalizedScore: 1,
				resemblanceScore: 1,
			},
		});

		it('renders a texts interpretation chooser', () => {
			const interpretation: RecognitionState = { texts: [dummyText()], shapes: [] };
			const parameterChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = parameterChooser
				.find(PrefixedJSONPropertyChooser)
				.findWhere(n => n.prop('prefixes')[0] === 'interpretation' && n.prop('prefixes')[1] === 'texts');

			expect(interpretationsChooser.length).to.equal(1);
		});

		it('puts the texts interpretation chooser to the position of the text connected strokes', () => {
			const interpretation: RecognitionState = { texts: [dummyText()], shapes: [] };
			const parameterChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = parameterChooser
				.find(PrefixedJSONPropertyChooser)
				.findWhere(n => n.prop('prefixes')[0] === 'interpretation' && n.prop('prefixes')[1] === 'texts');
			const positioner = parameterChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(interpretationsChooser.prop('position')).to.equal(null);
			expect(positioner.prop('style').left).to.equal(0);
			expect(positioner.prop('style').top).to.equal(5);
		});
	});

	describe('Clicking on a parameter checkbox', () => {
		it('removes its value if selected before', () => {
			const onParameterChoose = spy();
			const props = {
				...defaultProps(),
				strokes: [dummyStroke()],
				selectedStrokes: [dummyStroke()],
				parameters: [0, STROKE_ID, 10],
				checkedPaths: [
					'selectedStrokes --> 0 --> points --> 0 --> x',
					'selectedStrokes --> 0 --> id',
					'selectedStrokes --> 0 --> points --> 1 --> y',
				],
				onParameterChoose,
			};
			const prefixedChooser = shallowWithProps({ ...props });

			const chooser = prefixedChooser.find(PrefixedJSONPropertyChooser);
			chooser.prop('onParameterChoose')([
				'selectedStrokes --> 0 --> points --> 0 --> x',
				'selectedStrokes --> 0 --> points --> 1 --> y',
			]);

			expect(onParameterChoose.args[0][0]).to.deep.equal([0, 10]);
		});
	});
});
