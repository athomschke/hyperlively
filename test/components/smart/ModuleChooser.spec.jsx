import ModuleChooser from 'components/smart/ModuleChooser';
import TestUtils from 'react-addons-test-utils';
import React, { Component } from 'react';
import { point } from '../../helpers';

'use strict';

class MockedSubComponent1 extends Component {

	render () {
		return <canvas></canvas>;
	}
}

class MockedSubComponent2 extends React.Component {

	render () {
		return <a></a>;
	}
}

describe('ModuleChooser', () => {

	describe('enabling ploma', () => {

		it('is possible when at the same time changing strokes', () => {
			const MockedComponent = ModuleChooser([MockedSubComponent1, MockedSubComponent2]);
			var TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { componentIndex: 0 };
				},
				render() {
					return (<MockedComponent
						ref="sut"
						componentIndex={this.state.componentIndex}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10
						}}
						strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
					></MockedComponent>);
				}
			}));
			var parent = TestUtils.renderIntoDocument(TestParent());
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'canvas')).to.have.length(1);
			parent.setState({
				componentIndex: 1
			});
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'a')).to.have.length(1);
		});

		it('Always returns some Component', () => {
			const MockedComponent = ModuleChooser([MockedSubComponent1]);
			let TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { componentIndex: 0 };
				},
				render() {
					return (<MockedComponent
						ref="sut"
						componentIndex={1}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10
						}}
						strokes={[ {points: [ point(10,10), point(11,11) ]} ]}
					></MockedComponent>);
				}
			}));
			let parent = TestUtils.renderIntoDocument(TestParent());
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'canvas')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'a')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent.refs.sut, 'div')).to.have.length(1);
		});

	});

});