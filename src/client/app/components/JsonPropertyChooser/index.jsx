// @flow
import React, { PureComponent } from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep, map, keys } from 'lodash';

import type { TreeParameter, JSONPath } from 'src/client/app/types';

import { getPathToProperty, findArraysIndex, formatObject } from './choosingActions';

export type JSONObject = {
	[key: string]: any;
}

export type JsonPropertyChooserProps = {
	jsonTree: JSONObject,
	checkedPaths: JSONPath,
	collapsedPaths: JSONPath,
	onParameterChoose: (parameters: Array<TreeParameter>) => void,
	onCheckedPathsChange: (checkedPaths: Array<Array<string>>) => void,
	onCollapsedPathsChange: (collapsedPaths: Array<Array<string>>) => void,
}

export default class JsonPropertyChooser extends PureComponent<JsonPropertyChooserProps> {
	static defaultProps: JsonPropertyChooserProps = {
		jsonTree: {},
		checkedPaths: [],
		collapsedPaths: [],
		onParameterChoose: _parameters => undefined,
		onCheckedPathsChange: _parameters => undefined,
		onCollapsedPathsChange: _parameters => undefined,
	}

	componentWillReceiveProps(props: any) {
		this.state = Object.assign({}, this.state, {
			collapsedPaths: map(keys(props.jsonTree), key => [key]),
		});
	}

	onTreeNodeCheckChange(path: Array<number>) {
		const pathToProperty: Array<string> =
			getPathToProperty(path, this.getFormattedData());
		const checkedIndex: number =
			findArraysIndex(this.props.checkedPaths, pathToProperty);
		let checkedPaths: Array<Array<string>>;
		if (checkedIndex >= 0) {
			checkedPaths = this.props.checkedPaths
				.slice(0, checkedIndex)
				.concat(this.props.checkedPaths.slice(checkedIndex + 1));
		} else {
			checkedPaths = this.props.checkedPaths.concat([pathToProperty]);
		}
		const rawData: JSONObject = {
			...this.props.jsonTree,
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
		this.props.onParameterChoose(values);
		this.props.onCheckedPathsChange(checkedPaths);
	}

	onTreeNodeCollapseChange(path: Array<number>) {
		const pathToProperty: Array<string> =
			getPathToProperty(path, this.getFormattedData());
		const collapsedIndex: number =
			findArraysIndex(this.props.collapsedPaths, pathToProperty);
		if (collapsedIndex >= 0) {
			this.props.onCollapsedPathsChange(this.props.collapsedPaths
				.slice(0, collapsedIndex)
				.concat(this.props.collapsedPaths.slice(collapsedIndex + 1)));
		} else {
			this.props.onCollapsedPathsChange(this.props.collapsedPaths.concat([pathToProperty]));
		}
	}

	getFormattedData() {
		const rawData: Object = cloneDeep(this.props.jsonTree);
		return formatObject(
			rawData,
			this.props.checkedPaths,
			this.props.collapsedPaths,
			this.props.checkedPaths,
			0);
	}

	props: JsonPropertyChooserProps

	render() {
		const data = this.getFormattedData();
		const style: any = {};
		const { jsonTree } = this.props;
		if (jsonTree.center || (jsonTree.filter && jsonTree.filter(datum => datum.center).length > 0)) {
			style.position = 'absolute';
			// const center = (jsonTree: any).center || (jsonTree: Array<any>)[0].center;
			// style.top = center.y;
			// style.left = center.x;
		}
		return (<div style={style}>
			<TreeMenu
				data={data}
				collapsible
				expandIconClass="expand"
				collapseIconClass="collapse"
				onTreeNodeCheckChange={(path) => {
					this.onTreeNodeCheckChange(path);
				}}
				onTreeNodeCollapseChange={(path) => {
					this.onTreeNodeCollapseChange(path);
				}}
			/>
		</div>);
	}
}
