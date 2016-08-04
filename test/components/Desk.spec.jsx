import React from 'react';
import Desk from 'components/Desk';
import Canvas from 'components/Canvas';
import TestUtils from 'react-addons-test-utils';
import { point } from '../helpers'

describe('Desk', () => {

	it('Renders with default properties', () => {
		let desk = TestUtils.renderIntoDocument(<Desk></Desk>)
		expect(desk).to.exist;
	})

	it('Renders exactly one canvas when no sketches given', () => {
		let desk = TestUtils.renderIntoDocument(<Desk></Desk>)
		expect(desk).to.exist;		
		let node = TestUtils.findRenderedDOMComponentWithTag(desk, 'canvas');
		expect(node).to.exist
	})

	it('Sets the sketch canvas size to its content plus offset once their sketch is finished', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			sketches={[{
				strokes: [{
					points: [point(7,10), point(7,15), point(15,15), point(15,10)],
					finished: true
				}]
			}]}
		></Desk>)
		let components = TestUtils.scryRenderedComponentsWithType(desk, Canvas);
		expect(components[0].props.bounds.width).to.equal(18)
		expect(components[0].props.bounds.height).to.equal(15)
	})

	it('Moves the sketch canvas its position', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			sketches={[{
				strokes: [{
					points: [point(7,10), point(7,15), point(15,15), point(15,10)],
					finished: true,
				}]
			}]}
		></Desk>)
		let components = TestUtils.scryRenderedComponentsWithType(desk, Canvas);
		expect(components[0].props.bounds.x).to.equal(2);
		expect(components[0].props.bounds.y).to.equal(5);
	})

	it('Does not capture events on the placeholder canvas', () => {
		let desk = TestUtils.renderIntoDocument(<Desk
			sketches={[{
				strokes: [{
					points: [point(7,10), point(7,15), point(15,15), point(15,10)],
					finished: true
				}],
				finished: true
			}]}
		></Desk>)
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes[0].style.getPropertyValue('pointer-events')).to.equal('auto');
		expect(nodes[1].style.getPropertyValue('pointer-events')).to.equal('none');
	})

})