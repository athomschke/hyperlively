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

	describe('creating a stroke', () => {

		it('adds the first stroke containing a single point', () => {
			expect(
				strokes([], {
					type: types.CREATE_STROKE,
					point: point(10,10)
				})
			).to.deep.equal(
				[{
					points: [point(10,10)]
				}]
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

	describe('finishing a stroke', () => {

		it('appends a point to the last stroke', () => {
			let givenStrokes = [{
					points: [ point(10,10) ],
					finished: true
				}, {
					points: [ point(10,10) ]
				}]
			let extendedStrokes = [{
					points: [point(10,10)],
					finished: true
				}, {
					points: [point(10,10), point(10,11)],
					finished: true
				}]
			let pointAppender = {
				type: types.FINISH_STROKE,
				point: point(10,11)
			}
			let actualStrokes = strokes(givenStrokes, pointAppender)
			expect( actualStrokes ).to.deep.equal( extendedStrokes )
		})

	})
})