import sketches from 'reducers/sketches'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

describe('sketches', () => {

	describe('handling the initial state', () => {

		it('creates an empty array of strokes', () => {
			expect(
				sketches(undefined, {})
			).to.deep.equal(
				[]
			)
		})
	
	})

	describe('adding a point', () => {

		it('when no sketch exists creates a sketch', () => {
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

		it('appends a point always to the last sketch', () => {
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

	})

	describe('starting a stroke', () => {

		it('when no sketch exists creates a sketch', () => {
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

		it('appends a stroke to the only sketch', () => {
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

		it('appends a stroke to the last sketch', () => {
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

	describe('finishing a stroke', () => {

		it('marks the only sketch as finished', () => {
			let currentSketches = [{
				strokes: [{
					points: [point(10,10), point(10,11)]
				}],
				position: point(10,10)
			}]
			let actualResult = sketches(currentSketches, {
				type: types.FINISH_STROKE,
				point: point(10,12)
			})
			let expectedResult = [{
				strokes: [{
					points: [point(10,10), point(10,11), point(10,12)],
					finished: true
				}],
				finished: true,
				position: point(10,10)
			}]
			expect(
				actualResult
			).to.deep.equal(
				expectedResult
			)
		})

		it('marks the last sketch as finished', () => {
			let currentSketches = [{
				strokes: [{
					points: [point(10,10), point(10,11)]
				}],
				position: point(10,10)
			}, {
				strokes: [{
					points: [point(10,10), point(10,11)]
				}],
				position: point(10,10)
			}]
			let actualResult = sketches(currentSketches, {
				type: types.FINISH_STROKE,
				point: point(10,12)
			})
			let expectedResult = [{
				strokes: [{
					points: [point(10,10), point(10,11)]
				}],
				position: point(10,10)
			}, {
				strokes: [{
					points: [point(10,10), point(10,11), point(10,12)],
					finished: true
				}],
				finished: true,
				position: point(10,10)
			}]
			expect(
				actualResult
			).to.deep.equal(
				expectedResult
			)
		})

	})


})