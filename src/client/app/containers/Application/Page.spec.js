// @flow
import { expect } from 'chai';

import { exampleStrokes, point } from 'src/client/app/helpers.spec';

import { getSelectedStrokes } from './Page';

describe('Page', () => {
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
