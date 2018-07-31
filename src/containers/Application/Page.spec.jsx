// @flow
import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { exampleStrokes, point } from 'src/helpers.spec';
import InterpretationChooser from 'src/containers/InterpretationChooser';

import Page, { getSelectedStrokes, type PageProps } from './Page';

const defaultProps = () => ({
	sketches: [],
	showInterpreter: false,
});

const shallowWithProps = (props: PageProps) => shallow(<Page {...props} />);

describe('Page', () => {
	describe('rendering', () => {
		it('shows a InterpretationChooser if toggled on', () => {
			const page = shallowWithProps({ ...defaultProps(), showInterpreter: true });
			expect(page.find(InterpretationChooser)).to.have.length(1);
		});
		it('does not show a InterpretationChooser if toggled on', () => {
			const page = shallowWithProps({ ...defaultProps(), showInterpreter: false });
			expect(page.find(InterpretationChooser)).to.have.length(0);
		});
	});

	describe('Choosing selected strokes from sketches', () => {
		const dummySketches = () => [{
			finished: true,
			strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
		}, {
			finished: true,
			strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
		}, {
			finished: true,
			strokes: exampleStrokes([point(0, 5), point(5, 0), point(10, 5), point(5, 10)]),
		}];

		it('returns an empty array if none are selected', () => {
			const sketches = dummySketches();
			expect(getSelectedStrokes(sketches)).to.have.length(0);
		});

		it('returns a non empty array if none are selected', () => {
			const sketches = dummySketches();
			sketches[0].strokes[0].selected = true;
			expect(getSelectedStrokes(sketches)).to.have.length(1);
		});
	});
});
