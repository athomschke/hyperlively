// @flow
import { last, keys, map, filter, isEqual, findIndex } from 'lodash';
import { type ReactTreeNodeFormat, type ReactTreeLeafFormat } from '../typeDefinitions';

export const findArraysIndex = (
		containingArray: Array<Array<any>>,
		containedArray: Array<any>)
		: number =>
	findIndex(containingArray, possibleMatch =>
		isEqual(possibleMatch, containedArray));

export const findArraysEndingOnItem = (
		arrays: Array<Array<string>>,
		item: string)
		: Array<Array<string>> =>
	filter(arrays, matchingCheck =>
		last(matchingCheck) === item);

const formatTreeNode = (
		object: Object,
		key: string,
		keyChecks: Array<Array<string>>,
		allChecks: Array<Array<string>>,
		children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>,
		keyCollapses: Array<Array<string>>)
		: ReactTreeNodeFormat => {
	const matchingChecks: Array<Array<string>> =
		findArraysEndingOnItem(keyChecks, key);
	const parameterIndex: number =
		findArraysIndex(allChecks, matchingChecks[0]);
	const parameterIndicator: string =
		parameterIndex >= 0 ? ` (property ${parameterIndex})` : '';
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
		allChecks: Array<Array<string>>)
		: ReactTreeLeafFormat => {
	const matchingChecks: Array<Array<string>> =
		findArraysEndingOnItem(keyChecks, key);
	const parameterIndex: number =
		findArraysIndex(allChecks, matchingChecks[0]);
	const parameterIndicator: string =
		parameterIndex >= 0 ? ` (property ${parameterIndex})` : '';
	return {
		checkbox: true,
		checked: matchingChecks.length > 0,
		key,
		label: `${key}: ${object[key]}${parameterIndicator}`,
	};
};

export const getPathToProperty = (
		nestedArrayPath: Array<number>,
		arrayedJsonTree: Array<ReactTreeNodeFormat | ReactTreeLeafFormat>)
		: Array<string> => {
	let node = {
		children: arrayedJsonTree,
	};
	return map(nestedArrayPath, (index) => {
		node = node.children[index];
		return node.key;
	});
};

export const arraysWithStringAtIndex = (
		arrays: Array<Array<string>>,
		string: string,
		index: number)
		: Array<Array<string>> =>
	filter(arrays, (array: Array<string>) =>
			array[index] === string);

export const formatObject = (
		anObject: Object,
		checkedArrays: Array<Array<string>>,
		collapsedArrays: Array<Array<string>>,
		origCheckedArrays: Array<Array<string>>,
		depth: number)
		: Array<ReactTreeLeafFormat | ReactTreeNodeFormat> =>
	map(keys(anObject), (key: string) => {
		const checksContainingNode: Array<Array<string>> =
			arraysWithStringAtIndex(checkedArrays, key, depth);
		const collapsesContainingNode: Array<Array<string>> =
			arraysWithStringAtIndex(collapsedArrays, key, depth);
		let children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat> = [];
		if (anObject[key] instanceof Object) {
			children = formatObject(
				anObject[key],
				checksContainingNode,
				collapsesContainingNode,
				origCheckedArrays,
				depth + 1);
		}
		if (children.length > 0) {
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
