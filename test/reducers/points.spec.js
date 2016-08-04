import points from 'reducers/points'
import { appendPoint } from 'actions/drawing'
import * as types from 'constants/actionTypes'
import { point, event } from '../helpers'

describe('points', () => {
	it('handles initial state', () => {
		expect(
			points(
				undefined,
				{}
			)
		).to.deep.equal(
			[]
		)
	})

	it('appends first point', () => {
		let pointAddEvent = event(10, 10, 100);
		let newPoint = point(10, 10, 100);
		expect(
			points(
				[],
				appendPoint(pointAddEvent)
			)
		).to.deep.equal(
			[newPoint]
		)
	})

	it('appends second point', () => {
		let existingPoint = point(10,10, 100);
		let pointAddEvent = event(10,11, 100);
		let newPoint = point(10, 11, pointAddEvent.timeStamp);
		expect(
			points(
				[existingPoint],
				appendPoint(pointAddEvent)
			)
		).to.deep.equal(
			[existingPoint, newPoint]
		)
	})
})