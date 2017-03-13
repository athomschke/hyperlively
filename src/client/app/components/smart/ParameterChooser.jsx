// @flow
import React, { Component, PropTypes } from 'react';
import { TreeMenu } from 'react-tree-menu';
import { cloneDeep, map, reduce } from 'lodash';
import { getPathToProperty, findArraysIndex, formatObject } from 'helpers/choosingActions';

type State = {
	collapsedPaths: Array<Array<string>>,
	checkedPaths: Array<Array<string>>,
};

export default class ParameterChooser extends Component {

	static propTypes = {
		jsonTree: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
		onParameterChoose: PropTypes.func,
	};

	static defaultProps = {
		jsonTree: {},
		lastStrokes: [],
		selectedStrokes: [],
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
		rawData.lastStrokes = this.props.lastStrokes;
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
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
		rawData.lastStrokes = this.props.lastStrokes;
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
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
