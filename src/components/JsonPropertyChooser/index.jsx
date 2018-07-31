// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import { cloneDeep } from 'lodash';
import Tree, { TreeNode } from 'rc-tree';

import type {
	Coordinate, ReactTreeLeafFormat, ReactTreeNodeFormat, SortedPath,
} from 'src/types';

import { formatObject } from './choosingActions';
import style from './index.scss';

export type JSONObject = {
	[key: string]: any;
}

export type JsonPropertyChooserProps = {
	position?: Coordinate,
	jsonTree: JSONObject,
	expandedPaths: Array<string>,
	checkedPaths: Array<SortedPath>,
	onCheckedPathsChange: (checkedPaths: Array<string>) => void,
	onExpandedPathsChange: (expandedPaths: Array<string>) => void,
}

const defaultProps = (): JsonPropertyChooserProps => ({
	position: { x: NaN, y: NaN },
	jsonTree: {},
	expandedPaths: [],
	checkedPaths: [],
	onCheckedPathsChange: _parameters => undefined,
	onExpandedPathsChange: _parameters => undefined,
});

const renderTreeNodes = (data: Array<ReactTreeLeafFormat | ReactTreeNodeFormat>) => data.map(nodeData => (
	<TreeNode
		title={nodeData.label}
		key={nodeData.key}
	>
		{nodeData.isLeaf ? null : renderTreeNodes(nodeData.children)}
	</TreeNode>
));

const JsonPropertyChooser = (props: JsonPropertyChooserProps = defaultProps()) => {
	const getFormattedData = () => {
		const rawData: Object = cloneDeep(props.jsonTree);
		return formatObject(
			rawData,
			props.checkedPaths,
			props.expandedPaths,
		);
	};

	const onCheckedPathsChange = ({ checked }) => {
		props.onCheckedPathsChange(checked);
	};

	const data = getFormattedData();
	const divStyle: any = {};
	const position = props.position;
	if (position) {
		divStyle.position = 'absolute';
		divStyle.left = position.x;
		divStyle.top = position.y;
	}

	const checkedPaths = props.checkedPaths.map(checkedPath => checkedPath.path);
	return (
		<div className={style.treeView} style={divStyle}>
			<Tree
				prefixCls="json-property-chooser-tree"
				expandedKeys={props.expandedPaths}
				defaultExpandedKeys={props.expandedPaths}
				checkedKeys={checkedPaths}
				defaultCheckedKeys={checkedPaths}
				defaultExpandParent={false}
				onCheck={onCheckedPathsChange}
				onExpand={props.onExpandedPathsChange}
				checkStrictly
				checkable
			>
				{renderTreeNodes(data)}
			</Tree>
		</div>
	);
};

export default JsonPropertyChooser;
