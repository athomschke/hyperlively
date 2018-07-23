// @flow
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';

import JsonPropertyChooser from 'src/components/JsonPropertyChooser';

import PrefixedJSONPropertyChooser, { type PrefixedJSONPropertyChooserProps, filterPaths } from './PrefixedJSONPropertyChooser';

const shallowWithProps = (props: PrefixedJSONPropertyChooserProps) => shallow(<PrefixedJSONPropertyChooser {...props} />);

const foo = () => ({
	bar: 'baz',
});

const asd = () => ({
	asdf: 'asdfg',
});

const defaultProps = (): PrefixedJSONPropertyChooserProps => ({
	prefixes: ['foo'],
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
			const prefixedChooser = shallowWithProps({
				...defaultProps(),
			});

			expect(prefixedChooser.find(JsonPropertyChooser).prop('jsonTree')).to.deep.equal(foo());
		});

		it('passes only the selected strokes checked paths to JsonPropertyChooser', () => {
			const checkedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const prefixedChooser = shallowWithProps({ ...defaultProps(), checkedPaths });

			expect(prefixedChooser.find(JsonPropertyChooser).prop('checkedPaths')).to.deep.equal(['bar']);
		});

		it('passes only the selected strokes collapsed paths to JsonPropertyChooser', () => {
			const expandedPaths = [
				'foo --> bar',
				'asd --> asdf',
			];
			const prefixedChooser = shallowWithProps({ ...defaultProps(), expandedPaths });

			expect(prefixedChooser.find(JsonPropertyChooser).prop('expandedPaths')).deep.equal(['bar']);
		});

		it('Traverses multiple prefixes', () => {
			const prefixes = ['foo', 'bar'];
			const prefixedChooser = shallowWithProps({ ...defaultProps(), prefixes });

			expect(prefixedChooser.find(JsonPropertyChooser).prop('jsonTree')).deep.equal('baz');
		});
	});


	describe('Choosing a property in "foo"', () => {
		it('triggers onParameterChoose with the same values', () => {
			const onParameterChoose = spy();
			const prefixedChooser = shallowWithProps({ ...defaultProps(), onParameterChoose });

			const chooser = prefixedChooser.find(JsonPropertyChooser);
			const values = [1, 2, 3];
			chooser.prop('onParameterChoose')(values);

			expect(onParameterChoose.args[0][0]).to.deep.equal(values);
		});

		it('adds a path in "foo" when not checked before', () => {
			const onCheckedPathsChange = spy();
			const checkedPaths = [
				'asd --> asdf',
			];
			const prefixedChooser = shallowWithProps({ ...defaultProps(), checkedPaths, onCheckedPathsChange });
			prefixedChooser.find(JsonPropertyChooser).prop('onCheckedPathsChange')(['bar']);

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
			const prefixedChooser = shallowWithProps({ ...defaultProps(), checkedPaths, onCheckedPathsChange });
			prefixedChooser.find(JsonPropertyChooser).prop('onCheckedPathsChange')([]);

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
			const prefixedChooser = shallowWithProps({ ...defaultProps(), expandedPaths, onExpandedPathsChange });
			prefixedChooser.find(JsonPropertyChooser).prop('onExpandedPathsChange')(['bar']);

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
			const prefixedChooser = shallowWithProps({ ...defaultProps(), expandedPaths, onExpandedPathsChange });
			prefixedChooser.find(JsonPropertyChooser).prop('onExpandedPathsChange')([]);

			expect(onExpandedPathsChange.args[0][0]).to.deep.equal([
				'asd --> asdf',
			]);
		});
	});

	describe('filtering paths', () => {
		it('remmoves prefixes and paths that do not apply', () => {
			expect(filterPaths(['foo', 'bar'], ['foo --> bar', 'asd --> asdf'])).to.deep.equal(['bar']);
		});
	});
});
