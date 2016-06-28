import points from 'reducers/points'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

describe('points', () => {
	it('handles initial state', () => {
		expect(
			points(undefined, {})
		).to.deep.equal(
			[]
		)
	})

	it('appends first point', () => {
		expect(
			points([], {
				type: types.APPEND_POINT,
				point: point(10,10)
			})
		).to.deep.equal(
			[point(10,10)]
		)
	})

	it('appends second point', () => {
		expect(
			points([point(10,10)], {
				type: types.APPEND_POINT,
				point: point(10,11)
			})
		).to.deep.equal(
			[point(10,10), point(10,11)]
		)
	})
})