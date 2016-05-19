import sketches from 'reducers/sketches'
import * as types from 'constants/actionTypes'

let point = (x, y) => {
	return {
		x: x,
		y: y
	}
}

describe('sketches', () => {
	it('handles initial state', () => {
		expect(
			sketches(undefined, {})
		).to.deep.equal(
			[]
		)
	})

	it('adding a point when no sketch exists creates a sketch', () => {
		expect(
			sketches([], {
				type: types.APPEND_POINT,
				point: point(10,10)
			})
		).to.deep.equal(
			[{
				strokes: [{
					points: [point(10,10)]
				}]
			}]
		)
	})

	it('adds a point to the last sketch', () => {
		let currentSketches = [{
			strokes: [{
				points: [point(10,10)]
			}]
		}]
		expect(
			sketches(currentSketches, {
				type: types.APPEND_POINT,
				point: point(10,11)
			})
		).to.deep.equal(
			[{
				strokes: [{
					points: [point(10,10), point(10,11)]
				}]
			}]
		)
	})
})