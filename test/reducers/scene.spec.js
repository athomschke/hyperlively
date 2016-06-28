import scenes from 'reducers/scenes'
import * as types from 'constants/actionTypes'
import { point } from '../helpers'

describe('scenes', () => {
	it('handles initial state', () => {
		
		expect(
			scenes(undefined, {}).past
		).to.deep.equal([]);
		
		expect(
			scenes(undefined, {}).future
		).to.deep.equal([]);
		
		expect(
			scenes(undefined, {}).present
		).to.deep.equal([]);

	})

	it('creates a sketch when the first point in scene is created', () => {
		let pointAppender = {
			type: types.APPEND_POINT,
			point: point(10,10)
		}
		let presentScenes = scenes(undefined, pointAppender).present;
		let expectedPresentScenes = [{
			sketches: [{
				strokes: [{
					points: [ point(10,10) ]
				}],
				position: point(10,10)
			}]
		}]
		expect(presentScenes).to.deep.equal(expectedPresentScenes);
	})

	it('creates a sketch when the first stroke in scene is created', () => {
		let strokeAppender = {
			type: types.CREATE_STROKE,
			point: point(10,10)
		}
		let presentScenes = scenes(undefined, strokeAppender).present;
		let expectedPresentScenes = [{
			sketches: [{
				strokes: [{
					points: [ point(10,10) ]
				}],
				position: point(10,10)
			}]
		}]
		expect(presentScenes).to.deep.equal(expectedPresentScenes);
	})

	it('adds a sketch when one exists already', () => {
		let strokeAppender = {
			type: types.CREATE_STROKE,
			point: point(10,10)
		}
		let presentScenes = scenes({
			past: [],
			future: [],
			present: [{
				sketches:[{
					strokes: []
				}, {
					strokes: []
				}]
			}]
		}, strokeAppender).present;
		let expectedPresentScenes = [{
			sketches: [{
				strokes: []	
			}, {
				strokes: [{
					points: [ point(10,10) ]
				}],
				position: point(10,10)
			}]
		}]
		expect(presentScenes).to.deep.equal(expectedPresentScenes);
	})
})