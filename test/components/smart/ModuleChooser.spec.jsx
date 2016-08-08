import ModuleChooser from 'components/smart/ModuleChooser';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { hashCode, point } from '../../helpers';

'use strict'

class MockedSubComponent1 extends React.Component {

	render () {
		return <canvas></canvas>;
	}
}

class MockedSubComponent2 extends React.Component {

	render () {
		return <a></a>;
	}
}

const MockedComponent = ModuleChooser([MockedSubComponent1, MockedSubComponent2]);

describe('ModuleChooser', () => {

	describe('enabling ploma', () => {

		it('is possible when at the same time changing strokes', () => {
			var TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { componentIndex: 0 };
				},
				render() {
					return <MockedComponent
						ref="sut"
						componentIndex={this.state.componentIndex}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10
						}}
						strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
					></MockedComponent>
				}
			}));
			var parent = TestUtils.renderIntoDocument(TestParent());
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'canvas')).to.have.length(1);
			parent.setState({
				componentIndex: 1
			})
			let canvasses = TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'canvas')
			let aes = TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'a')
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'a')).to.have.length(1);
		})

	})

})