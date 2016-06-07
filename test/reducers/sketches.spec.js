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
				}],
				position: point(10,10)
			}]
		)
	})

	it('creating a stroke when no sketch exists creates a sketch', () => {
		expect(
			sketches([], {
				type: types.CREATE_STROKE,
				point: point(10,10)
			})
		).to.deep.equal(
			[{
				strokes: [{
					points: [point(10,10)]
				}],
				position: point(10,10)
			}]
		)
	})

	it('adds a point to the last sketch', () => {
		let currentSketches = [{
			strokes: [{
				points: [point(10,10)]
			}],
			position: point(10,10)
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
				}],
				position: point(10,10)
			}]
		)
	})

	it('adds a stroke to the only sketch', () => {
		let currentSketches = [{
			strokes: [{
				points: [point(10,10)]
			}],
			position: point(10,10)
		}]
		let actualResult = sketches(currentSketches, {
			type: types.CREATE_STROKE,
			point: point(10,11)
		})
		let expectedResult = [{
			strokes: [{
				points: [point(10,10)]
			}, {
				points: [point(10,11)]
			}],
			position: point(10,10)
		}]
		expect(
			actualResult
		).to.deep.equal(
			expectedResult
		)
	})

	it('adds a stroke to the last sketch', () => {
		let currentSketches = [{
			strokes: [{
				points: [ point(10,10) ]
			}],
			position: point(10,10)
		}, {
			strokes: [{
				points: [ point(10,10) ]
			}],
			position: point(10,10)
		}]
		let actionCreator = {
			type: types.CREATE_STROKE,
			point: point(10,11)
		}
		let extendedSketches = [{
			strokes: [{
				points: [ point(10,10) ]
			}],
			position: point(10,10)
		}, {
			strokes: [{
				points: [ point(10,10) ]
			}, {
				points: [ point(10,11) ]
			}],
			position: point(10,10)
		}]
		expect(
			sketches(currentSketches, actionCreator)
		).to.deep.equal(
			extendedSketches
		)
	})
})