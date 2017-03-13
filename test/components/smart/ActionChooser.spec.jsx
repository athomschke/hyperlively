import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { TreeMenu } from 'react-tree-menu';
import { forEach, map, flatten, filter } from 'lodash';
import Modal from 'react-modal';
import { shallow } from 'enzyme';
import actions from 'actions/actions';
import InterpretationChooser from 'components/smart/InterpretationChooser';
import HoverList from 'components/smart/HoverList';
import { getPathToProperty, formatObject } from 'helpers/choosingActions';

const renderWithProps = props => TestUtils.renderIntoDocument(<InterpretationChooser {...props} />);
const shallowWithProps = props => shallow(<InterpretationChooser {...props} />);

const exampleChecks = [['a', 'a2'], ['b']];

const exampleCollapses = [['a']];

const exampleTree = {
	a: {
		a1: 'a1',
		a2: 'a2',
	},
	b: 'b',
	c: 'c',
};

const exampleLastStrokes = [{
	d: 'd',
}];

const exampleSelectedStrokes = [{
	e: 'e',
}];

const exampleArray = [
	{
		label: 'a',
		key: 'a',
		checkbox: true,
		checked: false,
		collapsed: false,
		collapsible: true,
		children: [
			{
				label: 'a1: a1',
				key: 'a1',
				checkbox: true,
				checked: false,
			},
			{
				label: 'a2: a2 (parameter 0)',
				key: 'a2',
				checkbox: true,
				checked: true,
			},
		],
	},
	{
		label: 'b: b (parameter 1)',
		key: 'b',
		checkbox: true,
		checked: true,
	},
	{
		label: 'c: c',
		key: 'c',
		checkbox: true,
		checked: false,
	},
];

const flattenedTree = (root) => {
	let items = [root];
	forEach(root.children, (child) => {
		items = items.concat(flattenedTree(child));
	});
	return items;
};

const getItemsFromDataArray = dataArray => flatten(map(dataArray, item => flattenedTree(item)));

describe('Action Chooser', () => {
	afterEach(() => {
		forEach(document.getElementsByClassName('ReactModalPortal'), (modalNode) => {
			modalNode.parentNode.removeChild(modalNode);
		});
	});

	describe('showing the action chooser', () => {
		let actionChooser;

		beforeEach(() => {
			actionChooser = shallowWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				lastStrokes: exampleLastStrokes,
				selectedStrokes: exampleSelectedStrokes,
			});
		});

		it('renders a list', () => {
			const list = actionChooser.find(HoverList);
			expect(list.props().items.length).to.not.equal(0);
		});

		it('renders a tree menu', () => {
			expect(actionChooser.find(TreeMenu)).to.exist();
		});

		it('renders an entry for each top level handwriting recognition result plus one for the last strokes plus the selected strokes', () => {
			const items = getItemsFromDataArray(actionChooser.find(TreeMenu).props().data);
			expect(filter(items, 'label')).to.have.length(11);
		});

		it('renders a checkbox for each handwriting recognition result, nodes as well as leafes', () => {
			const items = getItemsFromDataArray(actionChooser.find(TreeMenu).props().data);
			expect(filter(items, 'checkbox')).to.have.length(11);
		});

		it('renders an item for each available action type', () => {
			const items = actionChooser.find(HoverList).props().items;
			expect(items).to.have.length(Object.keys(actions).length);
		});

		it('shows a modal dialog', () => {
			const modal = actionChooser.find(Modal);
			expect(modal.props().isOpen).to.be.true();
		});

		it('formats the json tree for the tree view menu', () => {
			const gottenArray = formatObject(
					exampleTree, exampleChecks, [], exampleChecks, 0);
			const wantedArray = exampleArray;
			expect(gottenArray).to.deep.equal(wantedArray);
		});

		it('checks the chosen checkmarks', () => {
			const formattedTree = formatObject(
					exampleTree, exampleChecks, [], exampleChecks, 0);
			expect(formattedTree[0].children[1].checked).to.be.true();
		});


		it('collapses collapsed nodes', () => {
			const formattedTree = formatObject(
					exampleTree, exampleChecks, exampleCollapses, exampleChecks, 0);
			expect(formattedTree[0].collapsed).to.be.true();
		});
	});

	describe('Checking a json property', () => {
		it('performs the callback', () => {
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			sinon.spy(actionChooser, 'onTreeNodeCheckChange');
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.onTreeNodeCheckChange.callCount).to.equal(1);
		});

		it('calculates the path to the nested property', () => {
			const formattedTree = formatObject(exampleTree, [], [], [], 0);
			const pathToProperty = getPathToProperty([0, 1], formattedTree);
			expect(pathToProperty).to.deep.equal(['a', 'a2']);
		});

		it('shows the checkmark', () => {
			renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			TestUtils.Simulate.click(checkbox);
			expect(checkbox.checked).to.be.true();
		});

		it('deselects it if it was selected', () => {
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const checkbox = document.getElementsByClassName('tree-view-node-checkbox')[0];
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.state.checkedPaths).to.have.length(1);
			TestUtils.Simulate.click(checkbox);
			expect(actionChooser.state.checkedPaths).to.have.length(0);
		});
	});

	describe('Collapsing a json property that is an object', () => {
		it('performs the callback', () => {
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const collapseIcon = document.getElementsByClassName('collapse')[0];
			sinon.spy(actionChooser, 'onTreeNodeCollapseChange');
			TestUtils.Simulate.click(collapseIcon);
			expect(actionChooser.onTreeNodeCollapseChange.callCount).to.equal(1);
		});

		it('toggles the collapse icon', () => {
			renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const collapseIcon = document.getElementsByClassName('collapse')[0];
			TestUtils.Simulate.click(collapseIcon);
			expect(collapseIcon.className).to.include('expand');
			expect(collapseIcon.className.split('tree-view-node-collapse-toggle')[1]).to.not.include('collapse');
		});
	});

	describe('Expanding a json property that is an object', () => {
		it('performs the callback', () => {
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const collapseIcon = document.getElementsByClassName('collapse')[0];
			sinon.spy(actionChooser, 'onTreeNodeCollapseChange');
			TestUtils.Simulate.click(collapseIcon);
			expect(actionChooser.onTreeNodeCollapseChange.callCount).to.equal(1);
		});

		it('toggles the collapse icon', () => {
			renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
			});
			const collapseIcon = document.getElementsByClassName('collapse')[0];
			TestUtils.Simulate.click(collapseIcon);
			TestUtils.Simulate.click(collapseIcon);
			expect(collapseIcon.className).to.include('collapse');
			expect(collapseIcon.className).to.not.include('expand');
		});
	});


	describe('Choosing an action', () => {
		it('performs the action', () => {
			const actionChooser = shallowWithProps({
				isOpen: true,
			});
			actionChooser.instance().componentDidMount();
			sinon.spy(actionChooser.instance(), 'onActionChoose');
			const list = actionChooser.find(HoverList);
			list.props().onItemClick({}, 'updatePosition');
			expect(actionChooser.instance().onActionChoose.callCount).to.equal(1);
		});

		it('selects checked values from json tree and passes them in an array', () => {
			let passedValues;
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				onActionChoose: (event, name, values) => {
					passedValues = values;
				},
			});
			actionChooser.setState({
				checkedPaths: exampleChecks,
			});
			actionChooser.onActionChoose({}, 'updateThreshold');
			expect(passedValues.length).to.equal(2);
			expect(passedValues[0]).to.equal('a2');
			expect(passedValues[1]).to.equal('b');
		});

		it('can pass selected strokes', () => {
			let passedValues;
			const actionChooser = renderWithProps({
				isOpen: true,
				jsonTree: exampleTree,
				selectedStrokes: exampleSelectedStrokes,
				onActionChoose: (event, name, values) => {
					passedValues = values;
				},
			});
			actionChooser.setState({
				checkedPaths: [['selectedStrokes', '0', 'e']],
			});
			actionChooser.onActionChoose({}, 'updateThreshold');
			expect(passedValues.length).to.equal(1);
			expect(passedValues[0]).to.equal('e');
		});

		it('does nothing without a callback', () => {
			const actionChooser = shallowWithProps({
				isOpen: true,
			});
			const list = actionChooser.find(HoverList);
			sinon.stub(actionChooser.instance(), 'onActionChoose');
			list.props().onItemClick({}, 'updatePosition');
			expect(actionChooser).to.exist();
			actionChooser.instance().onActionChoose.restore();
		});
	});
});
