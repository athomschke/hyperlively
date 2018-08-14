// @flow
import { expect } from 'chai';
import { flatten, map, forEach } from 'lodash';

import formatObject from './formatObject';

const flattenedTree = (root) => {
	let items = [root];
	forEach(root.isLeaf ? [] : root.children, (child) => {
		items = items.concat(flattenedTree(child));
	});
	return items;
};

const getItemsFromDataArray = dataArray => flatten(map(dataArray, item => flattenedTree(item)));

const exampleCollapses = ['a'];

const exampleTree = {
	a: {
		a1: 'a1',
		a2: 'a2',
	},
	b: 'b',
	c: 'c',
};

const exampleJSONData = [
	{
		isLeaf: false,
		label: 'a',
		key: 'a',
		checkbox: true,
		collapsed: false,
		collapsible: true,
		children: [
			{
				isLeaf: true,
				label: 'a1: a1',
				key: 'a --> a1',
				checkbox: true,
			},
			{
				isLeaf: true,
				label: 'a2: a2',
				key: 'a --> a2',
				checkbox: true,
			},
		],
	},
	{
		isLeaf: true,
		label: 'b: b',
		key: 'b',
		checkbox: true,
	},
	{
		isLeaf: true,
		label: 'c: c',
		key: 'c',
		checkbox: true,
	},
];

describe('Formatting the JSONPropertyChooser Data object', () => {
	it('formats the json tree for the tree view menu', () => {
		const gottenArray = formatObject(exampleTree, []);
		expect(gottenArray).to.deep.equal(exampleJSONData);
	});

	it('collapses collapsed nodes', () => {
		const formattedTree = formatObject(exampleTree, exampleCollapses);
		expect((formattedTree[0]:any).collapsed).to.be.true();
	});

	it('renders an entry for each top level handwriting recognition result plus one for the last strokes plus the selected strokes', () => {
		const formattedTree = formatObject(exampleTree, []);
		const items = getItemsFromDataArray(formattedTree);
		expect(items.filter(item => item.label)).to.have.length(5);
	});
});
