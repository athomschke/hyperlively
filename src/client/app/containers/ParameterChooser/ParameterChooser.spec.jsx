// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow, type ShallowWrapper } from 'enzyme';
import { spy } from 'sinon';

import JsonPropertyChooser from 'src/client/app/components/JsonPropertyChooser';
import { stroke } from 'src/client/app/reducers/data/strokes/stroke';
import type { Stroke, RecognitionResult, TextCandidate } from 'src/client/app/types';

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
	onCollapsedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	collapsedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

const shallowWithProps = (props: ParameterChooserProps) => shallow(<ParameterChooser {...props} />);
const selectedStrokesChooser = (parameterChooser: ShallowWrapper, selectedStrokes: Array<Stroke>) =>
	parameterChooser.find(JsonPropertyChooser).findWhere(n => n.prop('jsonTree') === selectedStrokes);

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders two json property choosers', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			expect(jsonPropertyChooser).to.have.length(2);
		});

		it('renders a selected stroke chooser', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });

			expect(selectedStrokesChooser(parameterChooser, selectedStrokes).length).to.equal(1);
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
		it('passes only the selected strokes to JsonPropertyChooser', () => {
			const selectedStrokes = [dummyStroke()];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });

			expect(selectedStrokesChooser(parameterChooser, selectedStrokes).prop('jsonTree')).to.deep.equal(selectedStrokes);
		});

		it('passes only the selected strokes checked paths to JsonPropertyChooser', () => {
			const selectedStrokes = [dummyStroke()];
			const checkedPaths = [
				['selectedStrokes', '1'],
				['lastStrokes', '2'],
			];
			const parameterChooser =
				shallowWithProps({ ...defaultProps(), selectedStrokes, checkedPaths });

			expect(selectedStrokesChooser(parameterChooser, selectedStrokes).prop('checkedPaths')).to.deep.equal([['1']]);
		});

		it('passes only the selected strokes collapsed paths to JsonPropertyChooser', () => {
			const selectedStrokes = [dummyStroke()];
			const collapsedPaths = [
				['selectedStrokes', '1'],
				['lastStrokes', '2'],
			];
			const parameterChooser =
				shallowWithProps({ ...defaultProps(), selectedStrokes, collapsedPaths });

			expect(selectedStrokesChooser(parameterChooser, selectedStrokes).prop('collapsedPaths')).deep.equal([['1']]);
		});

		it('sets the JsonParamterChooser for selected strokes on position of the strokes', () => {
			const center = { x: 15, y: 15 };
			const testStroke = {
				...dummyStroke(),
				points: [
					{ x: 10, y: 10, timeStamp: 100 },
					{ x: 20, y: 10, timeStamp: 102 },
					{ x: 20, y: 20, timeStamp: 104 },
					{ x: 10, y: 20, timeStamp: 106 },
					{ x: 10, y: 10, timeStamp: 108 },
				],
			};
			const selectedStrokes = [testStroke];
			const parameterChooser = shallowWithProps({ ...defaultProps(), selectedStrokes });

			expect(selectedStrokesChooser(parameterChooser, selectedStrokes).prop('position')).deep.equal(center);
		});
	});

	describe('Choosing a property in selected stroke', () => {
		it('triggers onParameterChoose with the same values', () => {
			const selectedStrokes = [dummyStroke()];
			const onParameterChoose = spy();
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				selectedStrokes,
				onParameterChoose,
			});

			const chooser = selectedStrokesChooser(parameterChooser, selectedStrokes);
			const values = [1, 2, 3];
			chooser.prop('onParameterChoose')(values);

			expect(onParameterChoose.args[0][0]).to.deep.equal(values);
		});

		it('adds a path in selectedStrokes when not checked before', () => {
			const selectedStrokes = [dummyStroke()];
			const onCheckedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const checkedPaths = [['lastStrokes', '1']];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				selectedStrokes,
				checkedPaths,
				onCheckedPathsChange,
			});
			const chooser = selectedStrokesChooser(parameterChooser, selectedStrokes);
			chooser.prop('onCheckedPathsChange')([['1']]);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([
				['lastStrokes', '1'],
				['selectedStrokes', '1'],
			]);
		});

		it('removes a path in selectedStrokes when checked before', () => {
			const selectedStrokes = [dummyStroke()];
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
				selectedStrokes,
				checkedPaths,
				onCheckedPathsChange,
			});
			const chooser = selectedStrokesChooser(parameterChooser, selectedStrokes);
			chooser.prop('onCheckedPathsChange')([]);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([['lastStrokes', '1']]);
		});
	});

	describe('Toggling a path in selected strokes', () => {
		it('adds a path in selectedStrokes when not collapsed before', () => {
			const selectedStrokes = [dummyStroke()];
			const onCollapsedPathsChange = spy();
			const jsonTree = {
				selectedStrokes: [dummyStroke()],
				lastStrokes: [dummyStroke()],
			};
			const collapsedPaths = [['lastStrokes', '1']];
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				jsonTree,
				selectedStrokes,
				collapsedPaths,
				onCollapsedPathsChange,
			});
			const chooser = selectedStrokesChooser(parameterChooser, selectedStrokes);
			chooser.prop('onCollapsedPathsChange')([['1']]);

			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([
				['lastStrokes', '1'],
				['selectedStrokes', '1'],
			]);
		});

		it('removes a path in selectedStrokes when collapsed before', () => {
			const selectedStrokes = [dummyStroke()];
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
				selectedStrokes,
				collapsedPaths,
				onCollapsedPathsChange,
			});
			const chooser = selectedStrokesChooser(parameterChooser, selectedStrokes);
			chooser.prop('onCollapsedPathsChange')([]);

			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([['lastStrokes', '1']]);
		});
	});
});
