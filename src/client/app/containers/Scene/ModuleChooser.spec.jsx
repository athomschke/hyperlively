// @flow
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

import { point } from 'src/client/app/helpers.spec';

import ModuleChooser, { type ModuleChooserProps } from './ModuleChooser';

const MockedSubComponent1 = () => <canvas />;
const MockedSubComponent2 = () => <span />;
const MockedComponent = ModuleChooser([MockedSubComponent1, MockedSubComponent2]);

class TestParentPrototype1 extends React.Component<ModuleChooserProps<{}>> {
	render() {
		return (<MockedComponent
			componentIndex={this.state ? this.state.componentIndex : 0}
			bounds={{
				width: 100,
				height: 50,
				x: 10,
				y: 10,
			}}
			strokes={[{ points: [point(10, 10), point(11, 11)] }]}
		/>);
	}
}

describe('ModuleChooser', () => {
	describe('enabling ploma', () => {
		it('is possible when at the same time changing strokes', () => {
			const TestParent = React.createFactory(TestParentPrototype1);
			const parent = TestUtils.renderIntoDocument(TestParent({
				componentIndex: 0,
			}));
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'canvas')).to.have.length(1);
			parent.setState({
				componentIndex: 1,
			});
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'span')).to.have.length(1);
		});

		it('Always returns some Component', () => {
			const TestParent = React.createFactory(TestParentPrototype1);
			const parent = TestUtils.renderIntoDocument(TestParent({
				componentIndex: 0,
			}));
			parent.setState({
				componentIndex: 2,
			});
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'canvas')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'span')).to.have.length(0);
			expect(TestUtils.scryRenderedDOMComponentsWithTag(parent, 'div')).to.have.length(1);
		});
	});
});
