// @flow
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';

import JsonPropertyChooser from 'src/components/JsonPropertyChooser';

import PrefixedJSONPropertyChooser, { type PrefixedJSONPropertyChooserProps } from './PrefixedJSONPropertyChooser';

const shallowWithProps = (props: PrefixedJSONPropertyChooserProps) => shallow(<PrefixedJSONPropertyChooser {...props} />);

const foo = () => ({
	bar: 'baz',
});

const asd = () => ({
	asdf: 'asdfg',
});

const defaultProps = (): PrefixedJSONPropertyChooserProps => ({
	prefix: 'foo',
	jsonTree: {
		foo: foo(),
		asd: asd(),
	},
	onParameterChoose: () => undefined,
	onCheckedPathsChange: () => undefined,
	onExpandedPathsChange: () => undefined,
	lastStrokes: [],
	selectedStrokes: [],
	checkedPaths: [],
	expandedPaths: [],
	interpretation: { shapes: [], texts: [] },
});

describe('PrefixedJSONPropertyChooser', () => {
	describe('Renderine a chooser for "foo"', () => {
		it('passes only the foo property to JsonPropertyChooser', () => {
			const parameterChooser = shallowWithProps({
				...defaultProps(),
			});

			expect(parameterChooser.find(JsonPropertyChooser).prop('jsonTree')).to.deep.equal(foo());
		});

		it('passes only the selected strokes checked paths to JsonPropertyChooser', () => {
			const checkedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), checkedPaths });

			expect(parameterChooser.find(JsonPropertyChooser).prop('checkedPaths')).to.deep.equal(['bar']);
		});

		it('passes only the selected strokes collapsed paths to JsonPropertyChooser', () => {
			const expandedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), expandedPaths });

			expect(parameterChooser.find(JsonPropertyChooser).prop('expandedPaths')).deep.equal(['bar']);
		});
	});


	describe('Choosing a property in "foo"', () => {
		it('triggers onParameterChoose with the same values', () => {
			const onParameterChoose = spy();
			const parameterChooser = shallowWithProps({ ...defaultProps(), onParameterChoose });

			const chooser = parameterChooser.find(JsonPropertyChooser);
			const values = [1, 2, 3];
			chooser.prop('onParameterChoose')(values);

			expect(onParameterChoose.args[0][0]).to.deep.equal(values);
		});

		it('adds a path in "foo" when not checked before', () => {
			const onCheckedPathsChange = spy();
			const checkedPaths = [
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), checkedPaths, onCheckedPathsChange });
			parameterChooser.find(JsonPropertyChooser).prop('onCheckedPathsChange')(['bar']);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([
				'asd --> asdf',
				'foo --> bar',
			]);
		});

		it('removes a path in "foo" when checked before', () => {
			const onCheckedPathsChange = spy();
			const checkedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), checkedPaths, onCheckedPathsChange });
			parameterChooser.find(JsonPropertyChooser).prop('onCheckedPathsChange')([]);

			expect(onCheckedPathsChange.args[0][0]).to.deep.equal([
				'asd --> asdf',
			]);
		});
	});

	describe('Toggling a path in "foo"', () => {
		it('adds a path in "foo" when not expanded before', () => {
			const onExpandedPathsChange = spy();
			const expandedPaths = [
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), expandedPaths, onExpandedPathsChange });
			parameterChooser.find(JsonPropertyChooser).prop('onExpandedPathsChange')(['bar']);

			expect(onExpandedPathsChange.args[0][0]).to.deep.equal([
				'asd --> asdf',
				'foo --> bar',
			]);
		});

		it('removes a path in "foo" when expanded before', () => {
			const onExpandedPathsChange = spy();
			const expandedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const parameterChooser = shallowWithProps({ ...defaultProps(), expandedPaths, onExpandedPathsChange });
			parameterChooser.find(JsonPropertyChooser).prop('onExpandedPathsChange')([]);

			expect(onExpandedPathsChange.args[0][0]).to.deep.equal([
				'asd --> asdf',
			]);
		});
	});
});
