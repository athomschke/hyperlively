import ploma from 'reducers/ploma'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

describe('ploma', () => {
	it('handles initial state', () => {
		let oldRandom = Math.random;
		Math.random = () => {
			return 0.3
		};
		let initialState = ploma(undefined, {});
		Math.random = oldRandom;
		expect(
			initialState
		).to.deep.equal({
			usePloma: true,
			uniqueCanvasFactor: 0.3
		})
	})

	it('appends first point', () => {
		expect(
			ploma({ usePloma: false, uniqueCanvasFactor: 0.4 }, {
				type: types.TOGGLE_PLOMA,
				bool: true
			})
		).to.deep.equal({
			usePloma: true,
			uniqueCanvasFactor: 0.4
		})
	})
})