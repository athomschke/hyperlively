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

})