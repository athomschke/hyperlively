// @flow
import { expect } from 'chai';

import { points } from 'src/client/app/reducers/data/strokes/points';
import { appendPoint } from 'src/client/app/actionCreators';
import { point, event } from 'test/helpers';

describe('points', () => {
	it('handles initial state', () => {
		expect(points(undefined, { type: '' })).to.deep.equal([]);
	});

	it('appends first point', () => {
		const pointAddEvent = event(10, 10, 100);
		const newPoint = point(10, 10, 100);
		expect(
			points(
				[],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			),
		).to.deep.equal(
			[newPoint],
		);
	});

	it('appends second point', () => {
		const existingPoint = point(10, 10, 100);
		const pointAddEvent = event(10, 11, 100);
		const newPoint = point(10, 11, pointAddEvent.timeStamp);
		expect(
			points(
				[existingPoint],
				appendPoint(pointAddEvent.pageX, pointAddEvent.pageY, pointAddEvent.timeStamp),
			),
		).to.deep.equal(
			[existingPoint, newPoint],
		);
	});
});