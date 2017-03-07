import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { point } from '../../helpers';
import ModuleChooser from 'components/smart/ModuleChooser';

const MockedSubComponent1 = () => <canvas />;
const MockedSubComponent2 = () => <span />;

describe('ModuleChooser', () => {
	describe('enabling ploma', () => {
		it('is possible when at the same time changing strokes', () => {
			const MockedComponent = ModuleChooser([MockedSubComponent1, MockedSubComponent2]);
			const TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { componentIndex: 0 };
				},
				render() {
					return (<MockedComponent
						componentIndex={this.state.componentIndex}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10,
						}}
						strokes={[{ points: [point(10, 10), point(11, 11)] }]}
					/>);
				},
			}));
			const parent = TestUtils.renderIntoDocument(TestParent());
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'canvas')).to.have.length(1);
			parent.setState({
				componentIndex: 1,
			});
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'span')).to.have.length(1);
		});

		it('Always returns some Component', () => {
			const MockedComponent = ModuleChooser([MockedSubComponent1]);
			const TestParent = React.createFactory(React.createClass({
				getInitialState() {
					return { componentIndex: 0 };
				},
				render() {
					return (<MockedComponent
						componentIndex={1}
						bounds={{
							width: 100,
							height: 50,
							x: 10,
							y: 10,
						}}
						strokes={[{ points: [point(10, 10), point(11, 11)] }]}
					/>);
				},
			}));
			const parent = TestUtils.renderIntoDocument(TestParent());
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'canvas')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'span')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'div')).to.have.length(1);
		});
	});
});
