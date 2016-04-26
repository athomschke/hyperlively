import strokes from 'reducers/strokes'
import * as types from 'constants/actionTypes'

let point = (x, y) => {
	return {
		x: x,
		y: y
	}
}

let pointAppender = (point) => {
	return {
		type: types.APPEND_POINT,
		point: point
	}
}

let strokeCreator = (point) => {
	return {
		type: types.CREATE_STROKE,
		point: point
	}
}

describe('strokes', () => {
	it('handles initial state', () => {
		expect(
			strokes(undefined, {})
		).to.deep.equal(
			[]
		)
	})

	it('does not append point when no strokes exist', () => {
		expect(
			strokes([], pointAppender(point(1,2)))
		).to.deep.equal(
			[]
		)
	})

	it('appends point to first stroke on canvas', () => {
		expect(
			strokes([[]], pointAppender(point(1,2)))
		).to.deep.equal(
			[[ point(1,2) ]]
		)
	})

	it('appends point to new stroke on canvas', () => {
		expect(
			strokes([[], []], pointAppender(point(1,2)))
		).to.deep.equal(
			[[], [point(1,2)]]
		);
	})

	it('appends point to canvas with a point on it', () => {
		expect(
			strokes([[ point(0,0) ]], pointAppender(point(1,2)))
		).to.deep.equal(
			[[ point(0,0), point(1,2) ]]
		)
	})

	it('creates the first stroke with a point', () => {
		expect(
			strokes([], strokeCreator(point(1,2)))
		).to.deep.equal(
			[[ point(1,2) ]]
		)
	})
})