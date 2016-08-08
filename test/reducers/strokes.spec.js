import { strokes } from 'reducers/strokes'
import { appendPoint, createStroke, finishStroke } from 'actions/drawing'
import { updateBounds } from 'actions/manipulating'
import { point, event } from '../helpers'

describe('strokes', () => {
	
	describe('handles', () => {

		it('initial state', () => {
			let result = strokes(
				undefined,
				{}
			)
			expect(result).to.deep.equal([])
		})

	})

	describe('creating a stroke', () => {

		it('adds the first stroke containing a single point', () => {
			let pointAddEvent = event(10, 10, 100)
			let newPoint = point(10, 10, 100);
			let result = strokes(
				[],
				createStroke(pointAddEvent)
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		})

		it('adds a stroke to an array of strokes', () => {
			let pointAddEvent = event(10, 10, 100)
			let newPoint = point(10, 10, 100);
			let result = strokes(
				[{
					points: [point(10,10), point(10,11), point(10,12)]
				}],
				createStroke(pointAddEvent)
			);
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint);
		})

		it('tags the stroke with the position of the first point', () => {
			let pointAddEvent = event(10, 10, 100)
			let newPoint = point(10, 10, 100);
			let result = strokes(
				[],
				createStroke(pointAddEvent)
			);
			expect(result[0].position).to.deep.equal({
				x: newPoint.x,
				y: newPoint.y
			})
		})

	})

	describe('appending a point', () => {

		it('creates a stroke containing it if none exists yet', () => {
			let pointAddEvent = event(10, 10, 100)
			let newPoint = point(10, 10, 100);
			let result = strokes(
				[],
				appendPoint(pointAddEvent)
			);
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(1);
			expect(result[0].points[0]).to.deep.equal(newPoint);
		})

		it('appends a point to the only stroke', () => {
			let pointAddEvent = event(10, 11, 100)
			let newPoint = point(10, 11, 100);
			let result = strokes(
				[{ points: [ point(10,10) ] }],
				appendPoint(pointAddEvent)
			)
			expect(result).to.have.length(1);
			expect(result[0].points).to.have.length(2);
			expect(result[0].points[1]).to.deep.equal(newPoint)
		})

		it('does not increase the number of strokes if multiple exist already', () => {
			let pointAddEvent = event(10, 11, 100)
			let newPoint = point(10, 11, 100);
			let result = strokes(
				[{ points: [] }, { points: [] }],
				appendPoint(pointAddEvent)
			)
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].points[0]).to.deep.equal(newPoint)
		})

	})

	describe('finishing a stroke', () => {

		it('appends a point to the last stroke', () => {
			let pointAddEvent = event(10, 11, 100)
			let newPoint = point(10, 11, 100);
			let result = strokes(
				[{ points: [] }, { points: [] }],
				finishStroke(pointAddEvent)
			)
			expect(result).to.have.length(2);
			expect(result[1].points).to.have.length(1);
			expect(result[1].finished).to.be.true;
			expect(result[1].points[0]).to.deep.equal(newPoint)
		})

	})

	describe('moving a stroke', () => {

		it('changes the coordinates of that strokes points', () => {
			let strokesToMove = [{
				points: [point(10, 11, 100), point(10, 12, 100), point(10, 13, 100)]
			}]
			let bounds = {
				x: 0,
				y: 1
			}
			let result = strokes(
				strokesToMove,
				updateBounds(strokesToMove, bounds)
			)
			expect(result[0].points[0].x).to.equal(10);
			expect(result[0].points[0].y).to.equal(12);
			expect(result[0].points[1].x).to.equal(10);
			expect(result[0].points[1].y).to.equal(13);
			expect(result[0].points[2].x).to.equal(10);
			expect(result[0].points[2].y).to.equal(14);
		})

	})
})