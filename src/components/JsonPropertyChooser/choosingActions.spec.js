// @flow
import { expect } from 'chai';
import { flatten, map, forEach } from 'lodash';

import type { ReactTreeLeafFormat, ReactTreeNodeFormat } from 'src/types';

import { formatObject } from './choosingActions';

const flattenedTree = (root) => {
	let items = [root];
	forEach(root.isLeaf ? [] : root.children, (child) => {
		items = items.concat(flattenedTree(child));
	});
	return items;
};

const getItemsFromDataArray = dataArray => flatten(map(dataArray, item => flattenedTree(item)));

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

const exampleArray = [
	{
		isLeaf: false,
		label: 'a',
		key: 'a',
		checkbox: true,
		checked: false,
		collapsed: false,
		collapsible: true,
		children: [
			{
				isLeaf: true,
				label: 'a1: a1',
				key: 'a1',
				checkbox: true,
				checked: false,
			},
			{
				isLeaf: true,
				label: 'a2: a2 (property 0)',
				key: 'a2',
				checkbox: true,
				checked: true,
			},
		],
	},
	{
		isLeaf: true,
		label: 'b: b (property 1)',
		key: 'b',
		checkbox: true,
		checked: true,
	},
	{
		isLeaf: true,
		label: 'c: c',
		key: 'c',
		checkbox: true,
		checked: false,
	},
];

describe('Formatting the JSONPropertyChooser Data object', () => {
	it('formats the json tree for the tree view menu', () => {
		const gottenArray = formatObject(
			exampleTree, exampleChecks, [], exampleChecks, 0,
		);
		const wantedArray = exampleArray;
		expect(gottenArray).to.deep.equal(wantedArray);
	});

	it('checks the chosen checkmarks', () => {
		const formattedTree: Array<ReactTreeLeafFormat | ReactTreeNodeFormat> = formatObject(
			exampleTree, exampleChecks, [], exampleChecks, 0,
		);
		expect((formattedTree[0]:any).children[1].checked).to.be.true();
	});

	it('collapses collapsed nodes', () => {
		const formattedTree = formatObject(
			exampleTree, exampleChecks, exampleCollapses, exampleChecks, 0,
		);
		expect((formattedTree[0]:any).collapsed).to.be.true();
	});

	it('renders an entry for each top level handwriting recognition result plus one for the last strokes plus the selected strokes', () => {
		const formattedTree = formatObject(exampleTree, [], [], [], 0);
		const items = getItemsFromDataArray(formattedTree);
		expect(items.filter(item => item.label)).to.have.length(5);
	});

	it('renders a checkbox for each handwriting recognition result, nodes as well as leafes', () => {
		const formattedTree = formatObject(
			exampleTree, exampleChecks, exampleCollapses, exampleChecks, 0,
		);
		const items = getItemsFromDataArray(formattedTree);
		expect(items.filter(item => item.checked)).to.have.length(2);
	});
});
