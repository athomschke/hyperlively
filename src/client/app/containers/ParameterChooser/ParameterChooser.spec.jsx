// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import JsonPropertyChooser from 'src/client/app/components/JsonPropertyChooser';
import type { Stroke } from 'src/client/app/types';

import ParameterChooser, { type ParameterChooserProps } from './ParameterChooser';

const dummyStrokes = (): Array<Stroke> => [{
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
}];

const defaultProps = (): ParameterChooserProps => ({
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onCollapsedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	collapsedPaths: [],
	interpretations: { shapes: [], texts: [] },
});

const shallowWithProps = (props: ParameterChooserProps) => shallow(<ParameterChooser {...props} />);

describe('Parameter Chooser Component', () => {
	describe('Rendering', () => {
		it('renders a json property chooser', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			expect(jsonPropertyChooser).to.have.length(1);
		});
	});

	describe('Choosing a json property', () => {
		it('is recognized in the parameter chooser', () => {
			const onParameterChoose = spy();
			const parameterChooser = shallowWithProps({ ...defaultProps(), onParameterChoose });
			const jsonPropertyChooser = parameterChooser.find(JsonPropertyChooser);
			jsonPropertyChooser.props().onParameterChoose();
			expect(onParameterChoose.callCount).to.equal(1);
		});
	});

	describe('Transforming the system state into a readable object or the json property chooser', () => {
		it('handles no last strokes, no candidates, no selected strokes', () => {
			const parameterChooser = shallowWithProps(defaultProps());
			const parameterObject = parameterChooser.find('JsonPropertyChooser').prop('jsonTree');
			expect(parameterObject).to.eql({
				shapes: [],
				texts: [],
			});
		});

		it('handles no last strokes, no candidates, but selected strokes', () => {
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				selectedStrokes: dummyStrokes(),
			});
			const parameterObject = parameterChooser.find('JsonPropertyChooser').prop('jsonTree');
			expect(parameterObject.selectedStrokes).to.have.length(1);
		});

		it('handles last strokes, no candidates, no selected strokes', () => {
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				lastStrokes: dummyStrokes(),
			});
			const parameterObject = parameterChooser.find('JsonPropertyChooser').prop('jsonTree');
			expect(parameterObject.lastStrokes).to.have.length(1);
		});

		it('handles last strokes, a text candidates, no selected strokes', () => {
			const parameterChooser = shallowWithProps({
				...defaultProps(),
				lastStrokes: dummyStrokes(),
				interpretations: {
					shapes: [],
					texts: [{
						label: 'I',
						normalizedScore: 0.95,
						resemblanceScore: 0.7,
					}],
				},
			});
			const parameterObject = parameterChooser.find('JsonPropertyChooser').prop('jsonTree');
			expect(parameterObject.texts).to.have.length(1);
		});
	});
});
