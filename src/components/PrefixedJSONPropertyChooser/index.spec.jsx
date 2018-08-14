// @flow
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';

import JsonPropertyChooser from 'src/components/JsonPropertyChooser';

import PrefixedJSONPropertyChooser, {
	type PrefixedJSONPropertyChooserProps,
	filterPaths,
	combinePaths,
	pathsWithPrefixes,
} from '.';

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
	onSelect: () => undefined,
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
			expect(filterPaths(['foo'], ['foo --> bar', 'asd --> asdf'])).to.deep.equal(['bar']);
		});

		it('deals with multilevel prefixes', () => {
			expect(filterPaths(['foo', 'bar'], ['foo --> bar --> baz', 'asd --> asdf'])).to.deep.equal(['baz']);
		});
	});

	describe('expanding a path in the second of two parameter choosers', () => {
		it('keeps the first path', () => {
			const onExpandedPathsChange = spy();
			const expandedPaths = [
				'foo --> bar',
			];
			const jsonTree = {
				foo: foo(),
				asd: asd(),
			};
			shallowWithProps({
				...defaultProps(),
				prefixes: ['foo'],
				jsonTree,
				expandedPaths,
				onExpandedPathsChange,
			});
			const asdPrefixedChooser = shallowWithProps({
				...defaultProps(),
				prefixes: ['asd'],
				jsonTree,
				expandedPaths,
				onExpandedPathsChange,
			});

			asdPrefixedChooser.find(JsonPropertyChooser).prop('onExpandedPathsChange')(['asdf']);

			expect(onExpandedPathsChange.args[0][0]).to.deep.equal(['foo --> bar', 'asd --> asdf']);
		});

		it('can include paths with same prefix', () => {
			const prefixes = ['interpretation', 'shapes', '1'];
			const paths = ['interpretation --> shapes --> 1 --> candidate'];
			expect(pathsWithPrefixes(paths, prefixes)).to.have.length(1);
		});

		it('can exclude paths with different prefix', () => {
			const prefixes = ['interpretation', 'shapes', '0'];
			const paths = ['interpretation --> shapes --> 1 --> candidate'];
			expect(pathsWithPrefixes(paths, prefixes)).to.have.length(0);
		});

		it('combines so that both paths are kept', () => {
			const prefixes = ['interpretation', 'shapes', '0'];
			const expandedPaths = ['interpretation --> shapes --> 1 --> candidate'];
			const shortPaths = ['strokeIds'];
			const combinedPaths = combinePaths(prefixes, expandedPaths, shortPaths);
			expect(combinedPaths).to.have.length(2);
			expect(combinedPaths).to.deep.equal([
				'interpretation --> shapes --> 1 --> candidate',
				'interpretation --> shapes --> 0 --> strokeIds',
			]);
		});

		it('maintains the oder of checked paths', () => {
			const prefixes = ['interpretation', 'shapes', '1'];
			const expandedPaths = [
				'interpretation --> shapes --> 1 --> foo',
				'interpretation --> shapes --> 0 --> candidate',
			];
			const shortPaths = ['foo', 'bar'];
			const combinedPaths = combinePaths(prefixes, expandedPaths, shortPaths);
			expect(combinedPaths).to.have.length(3);
			expect(combinedPaths).to.deep.equal([
				'interpretation --> shapes --> 1 --> foo',
				'interpretation --> shapes --> 0 --> candidate',
				'interpretation --> shapes --> 1 --> bar',
			]);
		});
	});
});
