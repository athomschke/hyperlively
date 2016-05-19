import strokes from 'reducers/strokes'
import * as types from 'constants/actionTypes'

let point = (x, y) => {
	return {
		x: x,
		y: y
	}
}

describe('strokes', () => {
	
	describe('handles', () => {

		it('initial state', () => {
			expect(
				strokes(undefined, {})
			).to.deep.equal(
				[]
			)
		})

	})

	describe('appending a point', () => {

		it('creates a stroke containing it if none exists yet', () => {
			expect(
				strokes([], {
					type: types.APPEND_POINT,
					point: point(10,10)
				})
			).to.deep.equal(
				[{
					points: [point(10,10)]
				}]
			)
		})

		it('appends a point to the only stroke', () => {
			expect(
				strokes([{
					points: [ point(10,10) ]
				}], {
					type: types.APPEND_POINT,
					point: point(10,11)
				})
			).to.deep.equal(
				[{
					points: [point(10,10), point(10,11)]
				}]
			)
		})

		it('appends a point to the last stroke', () => {
			let givenStrokes = [{
					points: [ point(10,10) ]
				}, {
					points: [ point(10,10) ]
				}]
			let extendedStrokes = [{
					points: [point(10,10)]
				}, {
					points: [point(10,10), point(10,11)]
				}]
			let pointAppender = {
				type: types.APPEND_POINT,
				point: point(10,11)
			}
			expect( strokes(givenStrokes, pointAppender) ).to.deep.equal( extendedStrokes )
		})
	})
})