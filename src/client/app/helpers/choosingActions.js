// @flow
import { last, keys, map, filter, isEqual, findIndex } from 'lodash';
import { type ReactTreeNodeFormat, type ReactTreeLeafFormat } from '../typeDefinitions';

export const findArraysIndex = (
		containingArray: Array<Array<string>>,
		containedArray: Array<Array<string>>) =>
	findIndex(containingArray, possibleMatch =>
		isEqual(possibleMatch, containedArray));

export const findArraysEndingOnItem = (arrays: Array<Array<string>>, item: string) =>
	filter(arrays, matchingCheck =>
		last(matchingCheck) === item);

const formatTreeNode = (
		object: Object,
		key: string,
		keyChecks: Array<Array<string>>,
		allChecks: Array<Array<string>>,
		children, keyCollapses) :
		ReactTreeNodeFormat => {
	const matchingChecks = findArraysEndingOnItem(keyChecks, key);
	const parameterIndex = findArraysIndex(allChecks, matchingChecks[0]);
	const parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
	return {
		checkbox: true,
		checked: matchingChecks.length > 0,
		key,
		label: `${key}${parameterIndicator}`,
		children,
		collapsed: findArraysEndingOnItem(keyCollapses, key).length > 0,
		collapsible: true,
	};
};

export const formatTreeLeaf = (
		object: Object,
		key: string,
		keyChecks: Array<Array<string>>,
		allChecks: Array<Array<string>>) : ReactTreeLeafFormat => {
	const matchingChecks = findArraysEndingOnItem(keyChecks, key);
	const parameterIndex = findArraysIndex(allChecks, matchingChecks[0]);
	const parameterIndicator = parameterIndex >= 0 ? ` (parameter ${parameterIndex})` : '';
	return {
		checkbox: true,
		checked: matchingChecks.length > 0,
		key,
		label: `${key}: ${object[key]}${parameterIndicator}`,
	};
};

export const getPathToProperty = (
		nestedArrayPath: Array<number>,
		arrayedJsonTree: Array<ReactTreeNodeFormat | ReactTreeLeafFormat>) => {
	let node = {
		children: arrayedJsonTree,
	};
	return map(nestedArrayPath, (index) => {
		node = node.children[index];
		return node.key;
	});
};

export const formatObject = (
		anObject: Object,
		checkedArrays: Array<Array<string>>,
		collapsedArrays: Array<Array<string>>,
		origCheckedArrays: Array<Array<string>>,
		depth: number) =>
	map(keys(anObject), (key) => {
		const checksContainingNode = filter(checkedArrays, checkedArray =>
			checkedArray[depth] === key);
		const collapsesContainingNode = filter(collapsedArrays, collapsedArray =>
			collapsedArray[depth] === key);
		let children;
		if (anObject[key] instanceof Object) {
			children = formatObject(
				anObject[key],
				checksContainingNode,
				collapsesContainingNode,
				origCheckedArrays,
				depth + 1);
		}
		if (children) {
			return formatTreeNode(
				anObject,
				key,
				checksContainingNode,
				origCheckedArrays,
				children,
				collapsesContainingNode);
		}
		return formatTreeLeaf(
			anObject,
			key,
			checksContainingNode,
			origCheckedArrays,
		);
	}, this);
