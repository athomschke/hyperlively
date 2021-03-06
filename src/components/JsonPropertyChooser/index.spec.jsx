// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Tree, { TreeNode } from 'rc-tree';
import { spy } from 'sinon';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from '.';

const renderWithProps = (props: JsonPropertyChooserProps) => shallow(<JsonPropertyChooser {...props} />);

const shallowWithProps = (props: JsonPropertyChooserProps) => shallow(<JsonPropertyChooser {...props} />);

const exampleTree = {
	a: {
		a1: 'a1 value',
		a2: 'a2 value',
	},
	b: 'b value',
	c: 'c value',
};

const defaultProps = (): JsonPropertyChooserProps => ({
	position: undefined,
	onParameterChoose: () => undefined,
	onSelect: () => undefined,
	onExpandedPathsChange: () => undefined,
	isOpen: true,
	checkedPaths: [],
	expandedPaths: [],
	jsonTree: {},
});

describe('JSONProperty Chooser', () => {
	describe('showing the parameter chooser', () => {
		it('renders a tree menu', () => {
			expect(shallowWithProps(defaultProps()).find(Tree)).to.have.length(1);
		});

		it('renders a TreeNode for each expanded object property, recursively', () => {
			const tree = shallowWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				expandedPaths: ['a'],
			});
			expect(tree.find(TreeNode)).to.have.length(5);
		});
	});

	describe('Toggling a path', () => {
		it('expands a collapsed path', () => {
			const onExpandedPathsChange = spy();
			const jsonPropertyChooser = shallowWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				onExpandedPathsChange,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onExpand')(['a']);
			expect(onExpandedPathsChange.args[0][0]).to.deep.equal(['a']);
		});

		it('collapses an expanded path', () => {
			const onExpandedPathsChange = spy();
			const jsonPropertyChooser = shallowWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				expandedPaths: ['a'],
				onExpandedPathsChange,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onExpand')([]);
			expect(onExpandedPathsChange.args[0][0]).to.deep.equal([]);
		});
	});

	describe('Clicking a path', () => {
		it('calls the callback with it as only parameter in the array', () => {
			const onSelect = spy();
			const jsonPropertyChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				onSelect,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onSelect')(['a --> a2']);
			expect(onSelect.args[0][0]).to.deep.equal(['a --> a2']);
		});
	});

	describe('positioning the JsonPropertyChooser', () => {
		it.skip('sets it to the first strokes center', () => {
			const jsonTree = {
				center: { x: 12, y: 12 },
			};
			const jsonPropertyChooser = renderWithProps({ ...defaultProps(), jsonTree });
			expect(jsonPropertyChooser.find('div').getNode().props.style.position).to.equal('absolute');
		});
	});
});
