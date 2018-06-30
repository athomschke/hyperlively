// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { TreeMenu } from 'react-tree-menu';
import { flatten, map, forEach, filter } from 'lodash';
import { spy } from 'sinon';

import type { ReactTreeLeafFormat, ReactTreeNodeFormat } from 'src/client/app/types';

import { formatObject } from './choosingActions';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from '.';

const renderWithProps = (props: JsonPropertyChooserProps) =>
	shallow(<JsonPropertyChooser {...props} />);

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
		const onCheckedPathsChange = spy();
		const onCollapsedPathsChange = spy();
		let parameterChooser;

		beforeEach(() => {
			parameterChooser = shallowWithProps({
				jsonTree: exampleTree,
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose: spy(),
				onCheckedPathsChange,
				onCollapsedPathsChange,
			});
		});

		it('performs the callback', () => {
			const treeMenu = parameterChooser.find(TreeMenu);
			treeMenu.prop('onTreeNodeCollapseChange')([0]);
			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([['a']]);
		});
	});

	describe('Expanding a json property that is an object', () => {
		let parameterChooser;
		const onCheckedPathsChange = spy();
		const onCollapsedPathsChange = spy();

		beforeEach(() => {
			parameterChooser = renderWithProps({
				jsonTree: exampleTree,
				checkedPaths: [],
				collapsedPaths: [['a']],
				onParameterChoose: () => undefined,
				onCheckedPathsChange,
				onCollapsedPathsChange,
			});
		});

		it('performs the callback', () => {
			const treeMenu = parameterChooser.find(TreeMenu);
			treeMenu.prop('onTreeNodeCollapseChange')([0]);
			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([]);
		});
	});

	describe('Checking a json property', () => {
		it('selects if it was not selected', () => {
			const onCheckedPathsChange = spy();
			const parameterChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				onCheckedPathsChange,
			});
			const treeMenu = parameterChooser.find(TreeMenu);
			treeMenu.prop('onTreeNodeCheckChange')([0, 1]);
			expect(onCheckedPathsChange.callCount).to.equal(1);
			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([['a', 'a2']]);
		});

		it('deselects it if it was selected', () => {
			const onCheckedPathsChange = spy();
			const parameterChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				checkedPaths: [['a', 'a2']],
				collapsedPaths: [],
				onCheckedPathsChange,
			});
			const treeMenu = parameterChooser.find(TreeMenu);
			treeMenu.prop('onTreeNodeCheckChange')([0, 1]);
			expect(onCheckedPathsChange.callCount).to.equal(1);
			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([]);
		});
	});
});
