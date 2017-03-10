import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { map, cloneDeep, reduce } from 'lodash';
import actions from 'actions/actions';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import { getPathToProperty, findArraysIndex, formatObject } from 'helpers/choosingActions';
import HoverList from './HoverList';

const getFunctionNameFromSignature = signature => signature.split('(')[0];

const getSignatureFromFunction = aFunction =>
		aFunction.toString().split(' {')[0].split('function ')[1];

const getActions = () => Object.keys(actions).map(actionName =>
	getSignatureFromFunction(actions[actionName]));

export default class ActionChooser extends Component {

	static propTypes = {
		onActionChoose: PropTypes.func,
		jsonTree: PropTypes.object,
		onCheckChange: PropTypes.func,
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		onActionChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {},
		lastStrokes: [],
		selectedStrokes: [],
	}

	componentDidMount() {
		this.state = {
			checkedPaths: [],
			collapsedPaths: [],
		};
	}

	onTreeNodeCheckChange(path) {
		const pathToProperty = getPathToProperty(path, this.getFormattedData());
		const checkedIndex = findArraysIndex(this.state.checkedPaths, pathToProperty);
		if (checkedIndex >= 0) {
			this.setState({
				checkedPaths: this.state.checkedPaths
					.slice(0, checkedIndex)
					.concat(this.state.checkedPaths.slice(checkedIndex + 1)),
			});
		} else {
			this.setState({
				checkedPaths: this.state.checkedPaths.concat([pathToProperty]),
			});
		}
		this.props.onCheckChange();
	}

	onTreeNodeCollapseChange(path) {
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

	onActionChoose(event, signature) {
		const rawData = {
			lastStrokes: this.props.lastStrokes,
		};
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		Object.assign(rawData, this.props.jsonTree);
		const values = map(this.state.checkedPaths, checkedPath =>
			reduce(checkedPath, (value, key) => value[key], rawData));
		this.props.onActionChoose(event, getFunctionNameFromSignature(signature), values);
		this.setState({
			checkedPaths: [],
		});
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
		return (
			<Modal
				className={actionChooser}
				ref="modal"
				{...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList
					ref="list"
					{...this.props}
					onItemClick={(event, name) => {
						this.onActionChoose(event, name);
					}}
					items={getActions()}
				/>
				<TreeMenu
					ref="tree"
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
				/>
			</Modal>);
	}

}
