// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep } from 'lodash';

import type { TreeParameter, JSONPath, Coordinate } from 'src/client/app/types';

import { getPathToProperty, findArraysIndex, formatObject } from './choosingActions';
import style from './index.scss';

export type JSONObject = {
	[key: string]: any;
}

export type JsonPropertyChooserProps = {
	position?: Coordinate,
	jsonTree: JSONObject,
	checkedPaths: JSONPath,
	collapsedPaths: JSONPath,
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	onCheckedPathsChange: (checkedPaths: Array<Array<string>>) => void,
	onCollapsedPathsChange: (collapsedPaths: Array<Array<string>>) => void,
}

const defaultProps = (): JsonPropertyChooserProps => ({
	position: { x: NaN, y: NaN },
	jsonTree: {},
	checkedPaths: [],
	collapsedPaths: [],
	onParameterChoose: _parameters => undefined,
	onCheckedPathsChange: _parameters => undefined,
	onCollapsedPathsChange: _parameters => undefined,
});

export default (props: JsonPropertyChooserProps = defaultProps()) => {
	const getFormattedData = () => {
		const rawData: Object = cloneDeep(props.jsonTree);
		return formatObject(
			rawData,
			props.checkedPaths,
			props.collapsedPaths,
			props.checkedPaths,
			0);
	};

	const onTreeNodeCheckChange = (path: Array<number>) => {
		const pathToProperty: Array<string> =
			getPathToProperty(path, getFormattedData());
		const checkedIndex: number =
			findArraysIndex(props.checkedPaths, pathToProperty);
		let checkedPaths: Array<Array<string>>;
		if (checkedIndex >= 0) {
			checkedPaths = props.checkedPaths
				.slice(0, checkedIndex)
				.concat(props.checkedPaths.slice(checkedIndex + 1));
		} else {
			checkedPaths = props.checkedPaths.concat([pathToProperty]);
		}
		const rawData: JSONObject = {
			...props.jsonTree,
		};
		const mixedValues = checkedPaths
			.map(checkedPath =>
				checkedPath.reduce((value, key) => {
					if (
						(typeof key === 'number' && value instanceof Array) ||
						(typeof key === 'string' && value instanceof Object)
					) {
						return value[key];
					}
					return null;
				},
				rawData,
				));
		// $FlowFixMe needs flow array type refinement, see https://github.com/facebook/flow/issues/1414
		const values: Array<JSONObject | any> = mixedValues.filter(value => value !== null);
		props.onParameterChoose(values);
		props.onCheckedPathsChange(checkedPaths);
	};

	const onTreeNodeCollapseChange = (path: Array<number>) => {
		const pathToProperty: Array<string> =
			getPathToProperty(path, getFormattedData());
		const collapsedIndex: number =
			findArraysIndex(props.collapsedPaths, pathToProperty);
		if (collapsedIndex >= 0) {
			props.onCollapsedPathsChange(props.collapsedPaths
				.slice(0, collapsedIndex)
				.concat(props.collapsedPaths.slice(collapsedIndex + 1)));
		} else {
			props.onCollapsedPathsChange(props.collapsedPaths.concat([pathToProperty]));
		}
	};

	const data = getFormattedData();
	const divStyle: any = {};
	const position = props.position;
	if (position) {
		divStyle.position = 'absolute';
		divStyle.left = position.x;
		divStyle.top = position.y;
	}
	return (<div className={style.treeView} style={divStyle}>
		<TreeMenu
			data={data}
			collapsible
			expandIconClass="expand"
			collapseIconClass="collapse"
			onTreeNodeCheckChange={onTreeNodeCheckChange}
			onTreeNodeCollapseChange={onTreeNodeCollapseChange}
		/>
	</div>);
};
