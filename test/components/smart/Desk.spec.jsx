import React from 'react';
import Desk from 'components/smart/Desk';
import TestUtils from 'react-addons-test-utils';
import { point } from '../../helpers';

class MockedSubComponent extends React.Component {

	render () {
		return <canvas></canvas>;
	}
}

const MockedComponent = Desk(MockedSubComponent);

describe('Desk', () => {

	it('Renders with default properties', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
		expect(desk).to.exist;
	});

	it('Renders exactly one canvas when no sketches given', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>);
		expect(desk).to.exist;		
		let node = TestUtils.findRenderedDOMComponentWithTag(desk, 'canvas');
		expect(node).to.exist;
	});

	it('Renders two canvasses when one finished sketch is given', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10)],
					finished: true
				}],
				finished: true
			}]}
		></MockedComponent>);
		expect(desk).to.exist;		
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(2);
	});

	it('Renders one canvas when one unfinished sketch without strokes is given', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{}]}
		></MockedComponent>);
		expect(desk).to.exist;		
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('doesn\'t render a canvas when all its strokes are hidden', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10), point(11,10), point(12,10)],
					hidden: true
				}],
				finished: true
			}]}
		></MockedComponent>);
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('Renders no placeholder canvas when the last stroke is unfinished', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10)]
				}]
			}]}
		></MockedComponent>);
		expect(desk).to.exist;		
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(1);
	});

	it('gives the background the provided width', () => {
		let width = 100;
		let height = 200;
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10)]
				}]
			}]}
			width={width}
			height={height}
		></MockedComponent>);
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'div');
		expect(parseInt(nodes[0].style.width)).to.equal(width);
		expect(parseInt(nodes[0].style.height)).to.equal(height);
	});

	it('colors the background in paperColor', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10)]
				}]
			}]}
			paperColor='rgb(240, 235, 219)'
		></MockedComponent>);
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'div');
		expect(nodes[0].style.getPropertyValue('background-color')).to.equal('rgb(240, 235, 219)');
	});

});