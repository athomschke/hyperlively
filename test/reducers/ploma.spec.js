import ploma from 'reducers/ploma'
import * as types from 'constants/actionTypes'

let point = (x, y) => {
	return {
		x: x,
		y: y
	}
}

describe('ploma', () => {
	it('handles initial state', () => {
		expect(
			ploma(undefined, {})
		).to.deep.equal(true)
	})

	it('appends first point', () => {
		expect(
			ploma({ usePloma: false }, {
				type: types.TOGGLE_PLOMA,
				bool: true
			})
		).to.deep.equal(true)
	})
})