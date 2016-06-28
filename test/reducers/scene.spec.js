import scene from 'reducers/scene'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

describe('scene', () => {
	it('handles initial state', () => {
		
		expect(
			scene(undefined, {}).past
		).to.deep.equal([]);
		
		expect(
			scene(undefined, {}).future
		).to.deep.equal([]);
		
		expect(
			scene(undefined, {}).present
		).to.deep.equal({
			sketches: []
		});

	})

	it('creates a sketch when the first point in scene is created', () => {
		let pointAppender = {
			type: types.APPEND_POINT,
			point: point(10,10)
		}
		let presentScene = scene([], pointAppender).present;
		let expectedPresentScene = {
			sketches: [{
				strokes: [{
					points: [ point(10,10) ]
				}],
				position: point(10,10)
			}]
		}
		expect(presentScene).to.deep.equal(expectedPresentScene);
	})

	it('creates a sketch when the first stroke in scene is created', () => {
		let strokeAppender = {
			type: types.CREATE_STROKE,
			point: point(10,10)
		}
		let presentScene = scene([], strokeAppender).present;
		let expectedPresentScene = {
			sketches: [{
				strokes: [{
					points: [ point(10,10) ]
				}],
				position: point(10,10)
			}]
		}
		expect(presentScene).to.deep.equal(expectedPresentScene);
	})
})