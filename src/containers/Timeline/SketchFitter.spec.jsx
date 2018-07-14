// @flow
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { exampleStrokes, point } from 'src/helpers.spec';

import SketchFitter, { type SketchFitterProps } from './SketchFitter';

const Wrapped = () => <div />;
const SketchFittedWrapped = SketchFitter(Wrapped);

const defaultProps = (): SketchFitterProps<{}> => ({
	bounds: {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	},
	htmlWidth: 100,
	index: 1,
	offsetIndex: 1,
	max: 1,
	fittedWidth: 100,
	previewHeight: 100,
	strokes: exampleStrokes([point(0, 0)]),
});

const renderWithProps = (props: SketchFitterProps<{}>) =>
	shallow(<SketchFittedWrapped {...props} />);

describe('Sketch Fitter', () => {
	describe('rendering strokes to previews', () => {
		it('works', () => {
			const component = renderWithProps(defaultProps());
			expect(component.find(Wrapped)).to.have.length(1);
		});
	});
});
