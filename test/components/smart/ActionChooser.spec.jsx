import React from 'react';
import TestUtils from 'react-addons-test-utils';
import actions from 'actions/actions';
import ActionChooser from 'components/smart/ActionChooser';
import { TreeMenu } from 'react-tree-menu';
import { forEach } from 'lodash';

let renderWithProps = (props) => {
	return TestUtils.renderIntoDocument(<ActionChooser {...props}/>);
};

describe('Action Chooser', () => {

	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

	describe('showing the action chooser', () => {

		let actionChooser;

		beforeEach(()=>{
			actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: {
					a: {
						a1: 'a1',
						a2: 'a2'
					},
					b: 'b',
					c: 'c'
				}
			});
		});

		it('renders a list', () => {
			expect(actionChooser.refs.list.props.items.length).to.not.equal(0);
		});

		it('renders a tree', () => {
			expect(actionChooser.refs.tree).to.exist;
			expect(actionChooser.refs.tree).to.be.instanceOf(TreeMenu);
		});

		it('renders an entry for each handwriting recognition result', () => {
			expect(TestUtils.scryRenderedDOMComponentsWithClass(actionChooser.refs.tree, 'tree-view-node-label')).to.have.length(5);
		});

		it('renders a checkbox for each handwriting recognition result', () => {
			expect(TestUtils.scryRenderedDOMComponentsWithTag(actionChooser.refs.tree, 'input')).to.have.length(4);
		});

		it('renders an item for each available action type', () => {
			expect(actionChooser.refs.list.props.items).to.have.length(Object.keys(actions).length);
		});

		it('shows a modal dialog', () => {
			expect(actionChooser.refs.modal.props.isOpen).to.be.true;
		});

	});


	describe('Choosing an action', () => {

		it('performs the action', () => {
			let actionChooser = renderWithProps({
				isOpen: true,
				onActionChoose: (event, actionName) => {
					chosenAction = actionName;
				}
			});
			let chosenAction = undefined;
			actionChooser.refs.list.props.onItemClick({}, 'updatePosition');
			expect(chosenAction).to.equal('updatePosition');
		});

		it('does nothing without a callback', () => {
			let actionChooser = renderWithProps({
				isOpen: true
			});
			actionChooser.refs.list.props.onItemClick({}, 'updatePosition');
			expect(actionChooser).to.exist;
		});
	});
	
});
