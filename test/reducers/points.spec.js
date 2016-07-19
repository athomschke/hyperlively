import points from 'reducers/points'
import { appendPoint } from 'actions/drawing'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

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
		let newPoint = point(10,10)
		expect(
			points(
				[],
				appendPoint(newPoint)
			)
		).to.deep.equal(
			[newPoint]
		)
	})

	it('appends second point', () => {
		let existingPoint = point(10,10);
		let newPoint = point(10,11)
		expect(
			points(
				[existingPoint],
				appendPoint(newPoint)
			)
		).to.deep.equal(
			[existingPoint, newPoint]
		)
	})
})