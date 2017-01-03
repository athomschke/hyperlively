import React from 'react';
import TestUtils from 'react-addons-test-utils';
import actions from 'actions/actions';
import ActionChooser from 'components/smart/ActionChooser';
import { TreeMenu } from 'react-tree-menu';
import { forEach } from 'lodash';

let renderWithProps = (props) => {
	return TestUtils.renderIntoDocument(<ActionChooser {...props}/>);
};

let exampleChecks = [['a', 'a2'], ['b']];

let exampleTree = {
	a: {
		a1: 'a1',
		a2: 'a2'
	},
	b: 'b',
	c: 'c'
};

let exampleArray = [
	{
		label: 'a',
		children: [
			{
				label: 'a1: a1',
				checkbox: true,
				checked: false
			},
			{
				label: 'a2: a2 (parameter 0)',
				checkbox: true,
				checked: true
			}
		]
	},
	{
		label: 'b: b (parameter 1)',
		checkbox: true,
		checked: true
	},
	{
		label: 'c: c',
		checkbox: true,
		checked: false
	}
];

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
				jsonTree: exampleTree
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

		it('formats the json tree for the tree view menu', () => {
			let gottenArray = ActionChooser.prototype.formatObject(exampleTree, exampleChecks);
			let wantedArray = exampleArray;
			expect(gottenArray).to.deep.equal(wantedArray);
		});

		it('checks the chosen checkmarks', () => {
			let formattedTree = ActionChooser.prototype.formatObject(exampleTree, exampleChecks);
			expect(formattedTree[0].children[1].checked).to.be.true;
		});

	});

	describe('Checking a json property', () => {
		it('performs the callback', () => {
			let actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree
			});
			let checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			sinon.spy(actionChooser, 'onTreeNodeCheckChange');
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.onTreeNodeCheckChange.callCount).to.equal(1);
		});

		it('calculates the path to the nested property', () => {
			let formattedTree = ActionChooser.prototype.formatObject(exampleTree);
			let pathToProperty = ActionChooser.prototype.getPathToProperty([0,1], formattedTree);
			expect(pathToProperty).to.deep.equal(['a', 'a2']);
		});

		it('shows the checkmark', () => {
			renderWithProps({
				isOpen: true,
				jsonTree: exampleTree
			});
			let checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			TestUtils.Simulate.click(checkbox);
			expect(checkbox.checked).to.be.true;
		});

		it('deselects it if it was selected', () => {
			let actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree
			});
			let checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			sinon.spy(actionChooser, 'onTreeNodeCheckChange');
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.state.checkedPaths).to.have.length(1);
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.state.checkedPaths).to.have.length(0);
		});

	});


	describe('Choosing an action', () => {

		it('performs the action', () => {
			let actionChooser = renderWithProps({
				isOpen: true,
			});
			sinon.spy(actionChooser, 'onActionChoose');
			actionChooser.refs.list.props.onItemClick({}, 'updatePosition');
			expect(actionChooser.onActionChoose.callCount).to.equal(1);
		});

		it('selects checked values from json tree and passes them in an array', () => {
			let passedValues;
			let actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				onActionChoose: (event, name, values) => {
					passedValues = values;
				}
			});
			actionChooser.setState({
				checkedPaths: exampleChecks
			});
			actionChooser.onActionChoose({}, 'updateThreshold');
			expect(passedValues.length).to.equal(2);
			expect(passedValues[0]).to.equal('a2');
			expect(passedValues[1]).to.equal('b');
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
