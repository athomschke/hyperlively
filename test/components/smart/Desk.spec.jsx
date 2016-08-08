import React from 'react';
import Desk from 'components/smart/Desk';
import TestUtils from 'react-addons-test-utils';
import { point } from '../../helpers'

class MockedSubComponent extends React.Component {

	render () {
		return <canvas></canvas>;
	}
}

const MockedComponent = Desk(MockedSubComponent);

describe('Desk', () => {

	it('Renders with default properties', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>)
		expect(desk).to.exist;
	})

	it('Renders exactly one canvas when no sketches given', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent></MockedComponent>)
		expect(desk).to.exist;		
		let node = TestUtils.findRenderedDOMComponentWithTag(desk, 'canvas');
		expect(node).to.exist
	})

	it('Renders two canvasses when one finished sketch is given', () => {
		let desk = TestUtils.renderIntoDocument(<MockedComponent
			sketches={[{
				strokes: [{
					points: [point(10,10)],
					finished: true
				}],
				finished: true
			}]}
		></MockedComponent>)
		expect(desk).to.exist;		
		let nodes = TestUtils.scryRenderedDOMComponentsWithTag(desk, 'canvas');
		expect(nodes).to.have.length(2);
	})

})