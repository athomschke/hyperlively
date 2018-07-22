// @flow
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Tree from 'rc-tree';
import { spy } from 'sinon';

import JsonPropertyChooser, { type JsonPropertyChooserProps } from '.';

const renderWithProps = (props: JsonPropertyChooserProps) => shallow(<JsonPropertyChooser {...props} />);

const shallowWithProps = (props: JsonPropertyChooserProps) => shallow(<JsonPropertyChooser {...props} />);

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
	isOpen: true,
	checkedPaths: [],
	collapsedPaths: [],
	jsonTree: {},
});

describe('JSONProperty Chooser', () => {
	describe('showing the parameter chooser', () => {
		it('renders a tree menu', () => {
			expect(shallowWithProps(defaultProps()).find(Tree)).to.have.length(1);
		});
	});

	describe('Collapsing a json property that is an object', () => {
		it('performs the callback', () => {
			const onCheckedPathsChange = spy();
			const onCollapsedPathsChange = spy();
			const parameterChooser = shallowWithProps({
				jsonTree: exampleTree,
				checkedPaths: [],
				collapsedPaths: [],
				onParameterChoose: spy(),
				onCheckedPathsChange,
				onCollapsedPathsChange,
			});
			const treeMenu = parameterChooser.find(Tree);
			treeMenu.prop('onTreeNodeCollapseChange')([0]);
			expect(onCollapsedPathsChange.args[0][0]).to.deep.equal([['a']]);
		});
	});

	describe('Expanding a json property that is an object', () => {
		it('performs the callback', () => {
			const onCheckedPathsChange = spy();
			const onCollapsedPathsChange = spy();

			const parameterChooser = renderWithProps({
				jsonTree: exampleTree,
				checkedPaths: [],
				collapsedPaths: [['a']],
				onParameterChoose: () => undefined,
				onCheckedPathsChange,
				onCollapsedPathsChange,
			});
			const treeMenu = parameterChooser.find(Tree);
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
			const treeMenu = parameterChooser.find(Tree);
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
			const treeMenu = parameterChooser.find(Tree);
			treeMenu.prop('onTreeNodeCheckChange')([0, 1]);
			expect(onCheckedPathsChange.callCount).to.equal(1);
			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([]);
		});
	});

	describe('positioning the JsonPropertyChooser', () => {
		it.skip('sets it to the first strokes center', () => {
			const jsonTree = {
				center: { x: 12, y: 12 },
			};
			const parameterChooser = renderWithProps({ ...defaultProps(), jsonTree });
			expect(parameterChooser.find('div').getNode().props.style.position).to.equal('absolute');
		});
	});
});
