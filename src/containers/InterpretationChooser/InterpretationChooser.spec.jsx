// @flow
import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';

import { stroke } from 'src/reducers/data/strokes/stroke';
import type {
	Stroke, RecognitionState, TextCandidateState, ShapeCandidateState,
} from 'src/types';
import ParameterChooser from 'src/containers/ParameterChooser';

import InterpretationChooser, { type InterpretationChooserProps } from './InterpretationChooser';

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

const defaultProps = (): InterpretationChooserProps => ({
	strokes: [dummyStroke()],
	selectedStrokes: [dummyStroke()],
	parameters: [],
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onExpandedPathsChange: () => undefined,
	lastStrokes: [],
	checkedPaths: [],
	expandedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

const shallowWithProps = (props: InterpretationChooserProps) => shallow(<InterpretationChooser {...props} />);

describe('InterpretationChooser Component', () => {
	describe('Rendering', () => {
		it('renders no ParameterChooser per defult', () => {
			const interpretationChooser = shallowWithProps({ ...defaultProps(), selectedStrokes: [], strokes: [] });
			const jsonPropertyChooser = interpretationChooser.find(ParameterChooser);

			expect(jsonPropertyChooser).to.have.length(0);
		});
	});

	describe('Drawing a stroke', () => {
		it('renders a ParameterChooser for selectedStrokes', () => {
			const selectedStrokes = [dummyStroke()];
			const interpretationChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });
			const selectedStrokesChooser = interpretationChooser.find(ParameterChooser).findWhere(
				n => n.prop('choosersProps')[0].prefixes[0] === 'selectedStrokes',
			);

			expect(selectedStrokesChooser).to.have.length(1);
		});

		it('puts the selected stroke chooser into the middle of the strokes', () => {
			const selectedStrokes = [dummyStroke()];
			const interpretationChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });
			const selectedStrokesChooser = interpretationChooser.find(ParameterChooser).findWhere(
				n => n.prop('choosersProps')[0].prefixes[0] === 'selectedStrokes',
			);
			const positioner = interpretationChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(selectedStrokesChooser.prop('position')).to.be.undefined();
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
			const aStroke = dummyStroke();
			const interpretationChooser = shallowWithProps({
				...defaultProps(),
				strokes: [aStroke],
				selectedStrokes: [aStroke],
				interpretation,
			});

			const interpretationsChooser = interpretationChooser
				.find(ParameterChooser)
				.findWhere(n => n.prop('choosersProps')[0].prefixes[0] === 'interpretation' && n.prop('choosersProps')[0].prefixes[1] === 'shapes');

			expect(interpretationsChooser.length).to.equal(1);
		});

		it('puts the shapes interpretation chooser into the middle of the shapes stroke', () => {
			const interpretation: RecognitionState = { texts: [], shapes: [dummyShape()] };
			const interpretationChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = interpretationChooser
				.find(ParameterChooser)
				.findWhere(n => n.prop('choosersProps')[0].prefixes[0] === 'interpretation' && n.prop('choosersProps')[0].prefixes[1] === 'shapes');
			const positioner = interpretationChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(interpretationsChooser.prop('position')).to.be.undefined();
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
			const interpretationChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = interpretationChooser
				.find(ParameterChooser)
				.findWhere(n => n.prop('choosersProps')[0].prefixes[0] === 'interpretation' && n.prop('choosersProps')[0].prefixes[1] === 'texts');

			expect(interpretationsChooser.length).to.equal(1);
		});

		it('puts the texts interpretation chooser to the position of the text connected strokes', () => {
			const interpretation: RecognitionState = { texts: [dummyText()], shapes: [] };
			const interpretationChooser = shallowWithProps({ ...defaultProps(), strokes: [dummyStroke()], interpretation });

			const interpretationsChooser = interpretationChooser
				.find(ParameterChooser)
				.findWhere(n => n.prop('choosersProps')[0].prefixes[0] === 'interpretation' && n.prop('choosersProps')[0].prefixes[1] === 'texts');
			const positioner = interpretationChooser.find('div').findWhere(
				n => n.prop('style') && n.prop('style').position === 'absolute',
			);

			expect(interpretationsChooser.prop('position')).to.be.undefined();
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

			const chooser = prefixedChooser.find(ParameterChooser);
			chooser.prop('onParameterChoose')([
				'selectedStrokes --> 0 --> points --> 0 --> x',
				'selectedStrokes --> 0 --> points --> 1 --> y',
			]);

			expect(onParameterChoose.args[0][0]).to.deep.equal([0, 10]);
		});
	});
});
