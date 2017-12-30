import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import { TreeMenu } from 'react-tree-menu';
import { flatten, map, forEach, filter } from 'lodash';

import JsonPropertyChooser from 'components/smart/JsonPropertyChooser';
import { getPathToProperty, formatObject } from 'helpers/choosingActions';

const renderWithProps = props => TestUtils.renderIntoDocument(<JsonPropertyChooser {...props} />);
const shallowWithProps = props => shallow(<JsonPropertyChooser {...props} />);

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
				label: 'a2: a2 (property 0)',
				key: 'a2',
				checkbox: true,
				checked: true,
			},
		],
	},
	{
		label: 'b: b (property 1)',
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

describe('JsonProperty Chooser', () => {
	describe('showing the parameter chooser', () => {
		let parameterChooser;

		beforeEach(() => {
			parameterChooser = shallowWithProps({
				isOpen: true,
				jsonTree: Object.assign({}, exampleTree, {
					lastStrokes: exampleLastStrokes,
				}, {
					selectedStrokes: exampleSelectedStrokes,
				}),
			});
		});

		it('renders a tree menu', () => {
			expect(parameterChooser.find(JsonPropertyChooser)).to.exist();
		});

		it('renders an entry for each top level handwriting recognition result plus one for the last strokes plus the selected strokes', () => {
			const items = getItemsFromDataArray(parameterChooser.find(TreeMenu).props().data);
			expect(filter(items, 'label')).to.have.length(11);
		});

		it('renders a checkbox for each handwriting recognition result, nodes as well as leafes', () => {
			const items = getItemsFromDataArray(parameterChooser.find(TreeMenu).props().data);
			expect(filter(items, 'checkbox')).to.have.length(11);
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

	describe('Collapsing a json property that is an object', () => {
		let parameterChooser;
		let collapseIcon;

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
			});
			collapseIcon = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'collapse')[0];
		});

		it('performs the callback', () => {
			sinon.spy(parameterChooser, 'onTreeNodeCollapseChange');
			TestUtils.Simulate.click(collapseIcon);
			expect(parameterChooser.onTreeNodeCollapseChange.callCount).to.equal(1);
		});

		it('toggles the collapse icon', () => {
			TestUtils.Simulate.click(collapseIcon);
			expect(collapseIcon.className).to.include('expand');
			expect(collapseIcon.className.split('tree-view-node-collapse-toggle')[1]).to.not.include('collapse');
		});
	});

	describe('Expanding a json property that is an object', () => {
		let parameterChooser;
		let collapseIcon;

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
			});
			collapseIcon = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'collapse')[0];
		});

		it('performs the callback', () => {
			sinon.spy(parameterChooser, 'onTreeNodeCollapseChange');
			TestUtils.Simulate.click(collapseIcon);
			expect(parameterChooser.onTreeNodeCollapseChange.callCount).to.equal(1);
		});

		it('toggles the collapse icon', () => {
			TestUtils.Simulate.click(collapseIcon);
			TestUtils.Simulate.click(collapseIcon);
			expect(collapseIcon.className).to.include('collapse');
			expect(collapseIcon.className).to.not.include('expand');
		});
	});

	describe('Checking a json property', () => {
		let parameterChooser;
		let checkbox;

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
			});
			checkbox = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'tree-view-node-checkbox')[0];
		});

		it('performs the callback', () => {
			sinon.spy(parameterChooser, 'onTreeNodeCheckChange');
			TestUtils.Simulate.click(checkbox);
			expect(parameterChooser.onTreeNodeCheckChange.callCount).to.equal(1);
		});

		it('calculates the path to the nested property', () => {
			const formattedTree = formatObject(exampleTree, [], [], [], 0);
			const pathToProperty = getPathToProperty([0, 1], formattedTree);
			expect(pathToProperty).to.deep.equal(['a', 'a2']);
		});

		it('shows the checkmark', () => {
			TestUtils.Simulate.click(checkbox);
			parameterChooser.setState({});
			expect(checkbox.checked).to.be.true();
		});

		it('deselects it if it was selected', () => {
			TestUtils.Simulate.click(checkbox);
			expect(parameterChooser.state.checkedPaths).to.have.length(1);
			TestUtils.Simulate.click(checkbox);
			expect(parameterChooser.state.checkedPaths).to.have.length(0);
		});
	});

	describe('Checking a selected stroke', () => {
		it('calls the callback with it', () => {
			let parameters;
			const parameterChooser = renderWithProps({
				jsonTree: Object.assign({}, exampleTree, {
					selectedStrokes: exampleSelectedStrokes,
				}),
				onParameterChoose: (params) => {
					parameters = params;
				},
			});
			const checkbox = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'tree-view-node-checkbox')[6];
			TestUtils.Simulate.click(checkbox);
			expect(parameterChooser.state.checkedPaths[0][0]).to.equal('selectedStrokes');
			expect(parameters[0]).to.deep.equal({ e: 'e' });
		});
	});
});
