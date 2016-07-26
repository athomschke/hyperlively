import sketches from 'reducers/sketches'
import { appendPoint, createStroke, finishStroke } from 'actions/drawing'
import * as types from 'constants/actionTypes'
import { THRESHOLD } from 'constants/drawing'
import { point } from '../helpers'
import { last } from 'lodash'

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

		it('to an empty canvas creates a sketch', () => {
			let result = sketches([], appendPoint(point(10,10)));
			expect(result).to.have.length(1);
		})

		it('appends a point to the last sketch', () => {
			let result = sketches([], appendPoint(point(10,10)));
			expect(result[0].strokes[0].points[0].x).to.deep.equal(10);
			expect(result[0].strokes[0].points[0].y).to.deep.equal(10);
		})

		it('cannot create a new sketch if one exists', () => {
			let currentSketches = [{
				strokes: []
			}]
			let result = sketches(currentSketches, appendPoint(point(10,11)));
			expect(result).to.have.length(1)
		})

	})

	describe('starting a stroke after a while', () => {

		it('when no sketch exists creates a sketch', () => {
			let result = sketches(
				[],
				createStroke(point(10,10))
			);
			expect(result).to.have.length(1)
		})

		it('adds a sketch if one sketch exists', () => {
			let result = sketches(
				[{ strokes: [] }],
				createStroke(point(10,10))
			);
			expect(result).to.have.length(2);
		})

		it('adds a sketch if multiple sketches exist', () => {
			let result = sketches(
				[{ strokes: [] }, { strokes: [] }],
				createStroke(point(10,10))
			);
			expect(result).to.have.length(3);
		})

	})

	describe('starting a stroke quickly', () => {

		it('adds a stroke to the last sketch', () => {
			let latestPoint = point(10,10, 111)
			let newPoint = point(10,10, 112)
			let result = sketches(
				[{
					strokes: [{
						points: [point(10,10), point(10,11), point(10,12)]
					}, {
						points: [point(20,10), point(20,11), latestPoint]
					}, ]
				}],
				createStroke(newPoint)
			);
			expect(result).to.have.length(1);
			expect(result[0].strokes).to.have.length(3);
			expect(last(result[0].strokes).points).to.have.length(1);
			expect(last(result[0].strokes).points[0]).to.deep.equal(newPoint);
		})

	})

	describe('finishing a stroke', () => {

		it('marks the only sketch as finished', () => {
			let result = sketches(
				[{ strokes: [] }],
				finishStroke(point(10,10))
			);
			expect(result[0].finished).to.be.true
		})

		it('marks the last sketch as finished', () => {
			let result = sketches(
				[{ strokes: [] }, { strokes: [] }],
				finishStroke(point(10,10))
			);
			expect(result[1].finished).to.be.true
		})

	})


})