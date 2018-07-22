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
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
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

	describe('Toggling checkbox of a path', () => {
		it('selects if it was not selected', () => {
			const onCheckedPathsChange = spy();
			const jsonPropertyChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				onCheckedPathsChange,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onCheck')({ checked: ['a --> a2'] });
			expect(onCheckedPathsChange.args[0][0]).to.deep.equal(['a --> a2']);
		});

		it('deselects it if it was selected', () => {
			const onCheckedPathsChange = spy();
			const jsonPropertyChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				checkedPaths: ['a --> a2'],
				onCheckedPathsChange,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onCheck')({ checked: [] });
			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([]);
		});

		it('triggers a parameter choose with the chosen values', () => {
			const onParameterChoose = spy();
			const jsonPropertyChooser = renderWithProps({
				...defaultProps(),
				jsonTree: exampleTree,
				checkedPaths: ['a --> a2'],
				onParameterChoose,
			});
			const treeMenu = jsonPropertyChooser.find(Tree);
			treeMenu.prop('onCheck')({ checked: ['a --> a2', 'a --> a1'] });
			expect(onParameterChoose.args[0][0]).to.deep.equal(['a2 value', 'a1 value']);
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
