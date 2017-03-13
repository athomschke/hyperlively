// @flow
import React, { Component, PropTypes } from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep, map, reduce } from 'lodash';
import { getPathToProperty, findArraysIndex, formatObject } from 'helpers/choosingActions';

type State = {
	collapsedPaths: Array<Array<string>>,
	checkedPaths: Array<Array<string>>,
};

export default class JsonPropertyChooser extends Component {

	static propTypes = {
		jsonTree: PropTypes.object,
		onParameterChoose: PropTypes.func,
	};

	static defaultProps = {
		jsonTree: {},
		onParameterChoose: () => {},
	}

	state: State;

	componentDidMount() {
		this.state = {
			collapsedPaths: [],
			checkedPaths: [],
		};
	}

	onTreeNodeCheckChange(path: Array<number>) {
		const pathToProperty = getPathToProperty(path, this.getFormattedData());
		const checkedIndex = findArraysIndex(this.state.checkedPaths, pathToProperty);
		let checkedPaths;
		if (checkedIndex >= 0) {
			checkedPaths = this.state.checkedPaths
				.slice(0, checkedIndex)
				.concat(this.state.checkedPaths.slice(checkedIndex + 1));
		} else {
			checkedPaths = this.state.checkedPaths.concat([pathToProperty]);
		}
		const rawData = {};
		Object.assign(rawData, this.props.jsonTree);
		const values = map(checkedPaths, checkedPath =>
			reduce(checkedPath, (value, key) => value[key], rawData));
		this.props.onParameterChoose(values);
		this.setState({
			checkedPaths,
		});
	}

	onTreeNodeCollapseChange(path: Array<number>) {
		const pathToProperty = getPathToProperty(path, this.getFormattedData());
		const collapsedIndex = findArraysIndex(this.state.collapsedPaths, pathToProperty);
		if (collapsedIndex >= 0) {
			this.setState({
				collapsedPaths: this.state.collapsedPaths
					.slice(0, collapsedIndex)
					.concat(this.state.collapsedPaths.slice(collapsedIndex + 1)),
			});
		} else {
			this.setState({
				collapsedPaths: this.state.collapsedPaths.concat([pathToProperty]),
			});
		}
	}

	getFormattedData() {
		const rawData = cloneDeep(this.props.jsonTree);
		return formatObject(
			rawData,
			this.state && this.state.checkedPaths,
			this.state && this.state.collapsedPaths,
			this.state && this.state.checkedPaths,
			0);
	}

	render() {
		return (<TreeMenu
			data={this.getFormattedData()}
			collapsible
			expandIconClass="expand"
			collapseIconClass="collapse"
			onTreeNodeCheckChange={(path) => {
				this.onTreeNodeCheckChange(path);
			}}
			onTreeNodeCollapseChange={(path) => {
				this.onTreeNodeCollapseChange(path);
			}}
		/>);
	}

}
