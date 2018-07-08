// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow, type ShallowWrapper } from 'enzyme';
import { spy } from 'sinon';

import JsonPropertyChooser from 'src/client/app/components/JsonPropertyChooser';
import type { Stroke, RecognitionResult, TextCandidate } from 'src/client/app/types';

import ParameterChooser, { type ParameterChooserProps } from './ParameterChooser';

const dummyStroke = (): Stroke => ({
	points: [{
		x: 0,
		y: 0,
		timeStamp: 100,
	}, {
		x: 0,
		y: 10,
		timeStamp: 102,
	}],
	hidden: false,
	selected: true,
	angle: 0,
	center: {
		x: 0,
		y: 0,
	},
	finished: true,
	color: 'red',
	position: {
		x: 0,
		y: 0,
	},
});

const defaultProps = (): ParameterChooserProps => ({
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onCollapsedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	collapsedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

const shallowWithProps = (props: ParameterChooserProps) => shallow(<ParameterChooser {...props} />);
const lastStrokesChooser = (parameterChooser: ShallowWrapper, lastStrokes: Array<Stroke>) =>
	parameterChooser.find(JsonPropertyChooser).findWhere(n => n.prop('jsonTree') === lastStrokes);

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders three json property choosers', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			expect(jsonPropertyChooser).to.have.length(3);
		});

		it('renders a last stroke chooser', () => {
			const lastStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), lastStrokes });

			expect(lastStrokesChooser(parameterChooser, lastStrokes).length).to.equal(1);
		});

		it('renders a selected stroke chooser', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });

			const selectedStrokesChooser = parameterChooser
				.find(JsonPropertyChooser)
				.findWhere(n => n.prop('jsonTree') === selectedStrokes);

			expect(selectedStrokesChooser.length).to.equal(1);
		});

		it('renders an interpretation chooser', () => {
			const text: TextCandidate = {
				label: 'a',
				normalizedScore: 1,
				resemblanceScore: 1,
			};
			const interpretation: RecognitionResult = {
				texts: [text],
				shapes: [],
			};
			const parameterChooser = shallowWithProps({ ...defaultProps(), interpretation });

			const interpretationsChooser = parameterChooser
				.find(JsonPropertyChooser)
				.findWhere(n => n.prop('jsonTree') === interpretation);

			expect(interpretationsChooser.length).to.equal(1);
		});
	});

	describe('Drawing a stroke', () => {
		it('passes only the last strokes to JsonPropertyChooser', () => {
			const lastStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), lastStrokes });

			expect(lastStrokesChooser(parameterChooser, lastStrokes).prop('jsonTree')).to.deep.equal(lastStrokes);
		});

		it('passes only the last strokes checked paths to JsonPropertyChooser', () => {
			const lastStrokes = [dummyStroke()];
			const checkedPaths = [
				['lastStrokes', '1'],
				['selectedStrokes', '2'],
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), lastStrokes, checkedPaths });

			expect(lastStrokesChooser(parameterChooser, lastStrokes).prop('checkedPaths')).to.deep.equal([['1']]);
		});

		it('passes only the last strokes collapsed paths to JsonPropertyChooser', () => {
			const lastStrokes = [dummyStroke()];
			const collapsedPaths = [
				['lastStrokes', '1'],
				['selectedStrokes', '2'],
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), lastStrokes, collapsedPaths });

			expect(lastStrokesChooser(parameterChooser, lastStrokes).prop('collapsedPaths')).deep.equal([['1']]);
		});

		it('sets the JsonParamterChooser for last strokes on position of the strokes', () => {
			const center = { x: 15, y: 15 };
			const stroke = {
				...dummyStroke(),
				points: [
					{ x: 10, y: 10, timeStamp: 100 },
					{ x: 20, y: 10, timeStamp: 102 },
					{ x: 20, y: 20, timeStamp: 104 },
					{ x: 10, y: 20, timeStamp: 106 },
					{ x: 10, y: 10, timeStamp: 108 },
				],
			};
			const lastStrokes = [stroke];
			const parameterChooser = shallowWithProps({ ...defaultProps(), lastStrokes });

			expect(lastStrokesChooser(parameterChooser, lastStrokes).prop('position')).deep.equal(center);
		});
	});

	describe('Choosing a property in last stroke', () => {
		it('triggers onParameterChoose with the same values', () => {
			const lastStrokes = [dummyStroke()];
			const onParameterChoose = spy();
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				lastStrokes,
				onParameterChoose,
			});

			const chooser = lastStrokesChooser(parameterChooser, lastStrokes);
			const values = [1, 2, 3];
			chooser.prop('onParameterChoose')(values);

			expect(onParameterChoose.args[0][0]).to.deep.equal(values);
		});

		it('adds a path in lastStrokes when not checked before', () => {
			const lastStrokes = [dummyStroke()];
			const onCheckedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const checkedPaths = [['selectedStrokes', '1']];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				lastStrokes,
				checkedPaths,
				onCheckedPathsChange,
			});
			const chooser = lastStrokesChooser(parameterChooser, lastStrokes);
			chooser.prop('onCheckedPathsChange')([['1']]);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([
				['selectedStrokes', '1'],
				['lastStrokes', '1'],
			]);
		});

		it('removes a path in lastStrokes when checked before', () => {
			const lastStrokes = [dummyStroke()];
			const onCheckedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const checkedPaths = [
				['selectedStrokes', '1'],
				['lastStrokes', '1'],
			];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				lastStrokes,
				checkedPaths,
				onCheckedPathsChange,
			});
			const chooser = lastStrokesChooser(parameterChooser, lastStrokes);
			chooser.prop('onCheckedPathsChange')([]);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([['selectedStrokes', '1']]);
		});
	});

	describe('Toggling a path in last strokes', () => {
		it('adds a path in lastStrokes when not collapsed before', () => {
			const lastStrokes = [dummyStroke()];
			const onCollapsedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const collapsedPaths = [['selectedStrokes', '1']];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				lastStrokes,
				collapsedPaths,
				onCollapsedPathsChange,
			});
			const chooser = lastStrokesChooser(parameterChooser, lastStrokes);
			chooser.prop('onCollapsedPathsChange')([['1']]);

			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([
				['selectedStrokes', '1'],
				['lastStrokes', '1'],
			]);
		});

		it('removes a path in lastStrokes when collapsed before', () => {
			const lastStrokes = [dummyStroke()];
			const onCollapsedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const collapsedPaths = [
				['selectedStrokes', '1'],
				['lastStrokes', '1'],
			];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				lastStrokes,
				collapsedPaths,
				onCollapsedPathsChange,
			});
			const chooser = lastStrokesChooser(parameterChooser, lastStrokes);
			chooser.prop('onCollapsedPathsChange')([]);

			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([['selectedStrokes', '1']]);
		});
	});
});
