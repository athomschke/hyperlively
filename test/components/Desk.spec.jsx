import React from 'react';
import Desk from 'components/Desk';
import TestUtils from 'react-addons-test-utils';
import { point } from '../helpers'

describe('Desk', () => {

	it('Renders with default properties', () => {
		let desk = TestUtils.renderIntoDocument(<Desk></Desk>)
		expect(desk).to.exist;
	})

	it('Renders exactly one canvas when no strokes given', () => {
		let desk = TestUtils.renderIntoDocument(<Desk></Desk>)
		expect(desk).to.exist;
		expect(desk.refs['canvas-0']).to.exist;
		expect(desk.refs['canvas-1']).to.not.exist;
	})

	it('Creates a canvas for each stroke the last sketch', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			scene={{
				sketches: [{
					strokes: [point(10,10), point(11,11)]
				}, {
					strokes: [{
						points: [point(10,10), point(11,11)]
					}]
				}]
			}}
		></Desk>)
		expect(desk.refs['canvas-0']).to.exist;
		expect(desk.refs['canvas-1']).to.exist;
		expect(desk.refs['canvas-2']).to.not.exist;
	})

	it('Creates a canvas for emtpy strokes the last sketch', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			scene={{
				sketches: [{
					strokes: [point(10,10), point(11,11)]
				}, {
					strokes: [{
						points: [point(10,10), point(11,11)]
					}, {
						points: []
					}]
				}]
			}}
		></Desk>)
		expect(desk.refs['canvas-0']).to.exist;
		expect(desk.refs['canvas-1']).to.exist;
		expect(desk.refs['canvas-2']).to.exist;
		expect(desk.refs['canvas-3']).to.not.exist;
	})

	it('Sets the sketch canvas size to its content once their sketch is finished', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			scene={{
				sketches: [{
					strokes: [{
						points: [point(7,10), point(7,15), point(15,15), point(15,10)]
					}],
					finished: true
				}]
			}}
		></Desk>)
		expect(desk.refs['canvas-0'].props.width).to.equal(8);
		expect(desk.refs['canvas-0'].props.height).to.equal(5);
	})

	it('Move the sketch canvas its position', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			scene={{
				sketches: [{
					strokes: [{
						points: [point(7,10), point(7,15), point(15,15), point(15,10)]
					}],
					finished: true,
					position: point(10,10)
				}]
			}}
		></Desk>)
		expect(desk.refs['canvas-0'].props.x).to.equal(7);
		expect(desk.refs['canvas-0'].props.y).to.equal(10);
	})

})