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

let presentStroke = (strokes) => {
	return {
		past: [],
		present: strokes,
		future: []
	}
}

describe('strokes', () => {
	it('handles initial state', () => {
		expect(
			strokes(undefined, {}).present
		).to.deep.equal(
			[]
		)
	})

	it('does not append point when no strokes exist', () => {
		expect(
			strokes(presentStroke([]), pointAppender(point(1,2))).present
		).to.deep.equal(
			[]
		)
	})

	it('appends point to first stroke on canvas', () => {
		expect(
			strokes(presentStroke([[]]), pointAppender(point(1,2))).present
		).to.deep.equal(
			[[ point(1,2) ]]
		)
	})

	it('appends point to new stroke on canvas', () => {
		expect(
			strokes(presentStroke([[], []]), pointAppender(point(1,2))).present
		).to.deep.equal(
			[[], [point(1,2)]]
		);
	})

	it('appends point to canvas with a point on it', () => {
		expect(
			strokes(presentStroke([[ point(0,0) ]]), pointAppender(point(1,2))).present
		).to.deep.equal(
			[[ point(0,0), point(1,2) ]]
		)
	})

	it('creates the first stroke with a point', () => {
		expect(
			strokes(presentStroke([]), strokeCreator(point(1,2))).present
		).to.deep.equal(
			[[ point(1,2) ]]
		)
	})
})