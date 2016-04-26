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

describe('index strokes', () => {
	it('handles initial state', () => {
		expect(
			strokes(undefined, {})
		).to.deep.equal(
			[[]]
		)
	})

	it('appends point to empty canvas', () => {
		expect(
			strokes([[]], pointAppender(point(1,2)))
		).to.deep.equal(
			[[ point(1,2) ]]
		)
	})

	it('appends point to canvas with a point on it', () => {
		let reduced = strokes([[ point(0,0) ]], pointAppender(point(1,2)));
		expect(reduced).to.have.length(1);
		expect(
			reduced[0]
		).to.deep.equal(
			[ point(0,0), point(1,2) ]
		)
	})
})