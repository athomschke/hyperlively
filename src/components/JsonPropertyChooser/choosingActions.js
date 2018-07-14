// @flow
import { last, keys, map, filter, isEqual, findIndex } from 'lodash';

import type { ReactTreeNodeFormat, ReactTreeLeafFormat, JSONPath } from 'src/types';

export const findArraysIndex = (
	containingArray: JSONPath,
	containedArray: Array<any>,
): number =>
	findIndex(containingArray, possibleMatch =>
		isEqual(possibleMatch, containedArray));

export const findArraysEndingOnItem = (
	arrays: JSONPath,
	item: string,
	depth: number,
): JSONPath =>
	filter(arrays, matchingCheck =>
		(last(matchingCheck) === item) && matchingCheck.length === depth + 1);

const formatTreeNode = (
	object: Object,
	key: string,
	keyChecks: JSONPath,
	allChecks: JSONPath,
	children: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>,
	keyCollapses: JSONPath,
	depth: number,
): ReactTreeNodeFormat => {
	const matchingChecks: JSONPath =
		findArraysEndingOnItem(keyChecks, key, depth);
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
		collapsed: findArraysEndingOnItem(keyCollapses, key, depth).length > 0,
		collapsible: true,
	};
};

export const formatTreeLeaf = (
	object: Object,
	key: string,
	keyChecks: JSONPath,
	allChecks: JSONPath,
	depth: number,
): ReactTreeLeafFormat => {
	const matchingChecks: JSONPath =
		findArraysEndingOnItem(keyChecks, key, depth);
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
	arrayedJsonTree: Array<ReactTreeNodeFormat | ReactTreeLeafFormat>,
): Array<string> => {
	let node = {
		children: arrayedJsonTree,
	};
	return map(nestedArrayPath, (index) => {
		const children: any = node.children;
		if (children && children.length > 0) {
			node = children[index];
		} else {
			throw new Error('cannot access json property');
		}
		return node.key;
	});
};

export const arraysWithStringAtIndex = (
	arrays: Array<Array<string>>,
	string: string,
	index: number,
): Array<Array<string>> =>
	filter(arrays, (array: Array<string>) =>
		array[index] === string);

export const formatObject = (
	anObject: Object,
	checkedArrays: JSONPath,
	collapsedArrays: JSONPath,
	origCheckedArrays: JSONPath,
	depth: number,
): Array<ReactTreeLeafFormat | ReactTreeNodeFormat> =>
	keys(anObject).map((key: string) => {
		const checksContainingNode: JSONPath =
			arraysWithStringAtIndex(checkedArrays, key, depth);
		const collapsesContainingNode: JSONPath =
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
				collapsesContainingNode,
				depth);
		}
		return formatTreeLeaf(
			anObject,
			key,
			checksContainingNode,
			origCheckedArrays,
			depth,
		);
	}, this);
