// @flow
import { expect } from 'chai';
import React, { type Element as ReactElement } from 'react';
import TestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import { TreeMenu, TreeNode } from 'react-tree-menu';
import { flatten, map, forEach, filter } from 'lodash';
import { spy } from 'sinon';

import type { ReactTreeLeafFormat, ReactTreeNodeFormat } from 'src/client/app/typeDefinitions';
import JsonPropertyChooser, { type JsonPropertyChooserProps } from 'src/client/app/components/smart/JsonPropertyChooser';
import { getPathToProperty, formatObject } from 'src/client/app/helpers/choosingActions';

const renderWithProps = (props: JsonPropertyChooserProps) =>
	TestUtils.renderIntoDocument(<JsonPropertyChooser {...props} />);

const shallowWithProps = (props: JsonPropertyChooserProps) =>
	shallow(<JsonPropertyChooser {...props} />);

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

const defaultProps = (): JsonPropertyChooserProps => ({
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onCollapsedPathsChange: () => undefined,
	checkedPaths: [],
	collapsedPaths: [],
	jsonTree: {},
});

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
				...defaultProps(),
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
			const formattedTree: Array<ReactTreeLeafFormat | ReactTreeNodeFormat> = formatObject(
				exampleTree, exampleChecks, [], exampleChecks, 0);
			expect((formattedTree[0]:any).children[1].checked).to.be.true();
		});


		it('collapses collapsed nodes', () => {
			const formattedTree = formatObject(
				exampleTree, exampleChecks, exampleCollapses, exampleChecks, 0);
			expect((formattedTree[0]:any).collapsed).to.be.true();
		});
	});

	describe('Collapsing a json property that is an object', () => {
		let parameterChooser;
		let collapseIcon;

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose: () => undefined,
				onCheckedPathsChange: () => undefined,
				onCollapsedPathsChange: () => undefined,
			});
			collapseIcon = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'collapse')[0];
		});

		it('performs the callback', () => {
			spy(parameterChooser, 'onTreeNodeCollapseChange');
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
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose: () => undefined,
				onCheckedPathsChange: () => undefined,
				onCollapsedPathsChange: () => undefined,
			});
			collapseIcon = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'collapse')[0];
		});

		it('performs the callback', () => {
			spy(parameterChooser, 'onTreeNodeCollapseChange');
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
		let checkbox: ReactElement<'tree-view-node-checkbox'>;
		let checkboxNode: Element;
		const onParameterChoose = spy();
		const onCollapsedPathsChange = spy();
		const onCheckedPathsChange = spy();

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
				onCollapsedPathsChange,
				onCheckedPathsChange,
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose,
			});
			checkboxNode = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'tree-view-node-checkbox')[0];
			checkbox = TestUtils.scryRenderedComponentsWithType(parameterChooser, TreeNode)[0];
		});

		it('performs the callback', () => {
			spy(parameterChooser, 'onTreeNodeCheckChange');
			TestUtils.Simulate.click(checkboxNode);
			expect(parameterChooser.onTreeNodeCheckChange.callCount).to.equal(1);
		});

		it('calculates the path to the nested property', () => {
			const formattedTree = formatObject(exampleTree, [], [], [], 0);
			const pathToProperty = getPathToProperty([0, 1], formattedTree);
			expect(pathToProperty).to.deep.equal(['a', 'a2']);
		});

		it('shows the checkmark', () => {
			TestUtils.Simulate.click(checkboxNode);
			parameterChooser.setState({});
			expect(checkbox.props.checked).to.be.true();
		});

		it('deselects it if it was selected', () => {
			TestUtils.Simulate.click(checkboxNode);
			expect(onParameterChoose).to.have.been.called.Once();
			expect(onParameterChoose.calls[0].args[0]).to.have.length(1);
			TestUtils.Simulate.click(checkboxNode);
			expect(onParameterChoose).to.have.been.called.Twice();
			expect(onParameterChoose.calls[1].args[0]).to.have.length(0);
		});
	});

	describe('Checking a selected stroke', () => {
		const onCheckedPathsChange = spy();

		it('calls the callback with it', () => {
			const onParameterChoose = spy();
			const parameterChooser = renderWithProps({
				onCheckedPathsChange,
				onCollapsedPathsChange: () => undefined,
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose,
				jsonTree: {
					...exampleTree,
					selectedStrokes: exampleSelectedStrokes,
				},
			});
			const checkbox = TestUtils.scryRenderedDOMComponentsWithClass(parameterChooser, 'tree-view-node-checkbox')[6];
			TestUtils.Simulate.click(checkbox);
			expect(onCheckedPathsChange.calls[0].args[0][0]).to.equal('selectedStrokes');
			expect(onParameterChoose).to.have.been.calledWith([{ e: 'e' }]);
		});
	});
});
