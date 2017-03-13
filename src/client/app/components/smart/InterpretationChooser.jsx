// @flow
import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { map, cloneDeep, reduce } from 'lodash';
import { SyntheticMouseEvent } from 'flow-bin';
import { actionChooser } from 'stylesheets/components/smart/actionChooser.scss';
import { getPathToProperty, findArraysIndex, formatObject } from 'helpers/choosingActions';
import ActionChooser from './ActionChooser';

type State = {
	checkedPaths: Array<Array<string>>,
	collapsedPaths: Array<Array<string>>,
};

export default class InterpretationChooser extends Component {

	static propTypes = {
		onInterpretationChoose: PropTypes.func,
		jsonTree: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
		onCheckChange: PropTypes.func,
		lastStrokes: PropTypes.arrayOf(PropTypes.object),
		selectedStrokes: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		onInterpretationChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {},
		lastStrokes: [],
		selectedStrokes: [],
	}

	constructor() {
		super();
		this.onActionChoose = this.onActionChoose.bind(this);
	}

	state: State;

	componentDidMount() {
		this.state = {
			checkedPaths: [],
			collapsedPaths: [],
		};
	}

	onTreeNodeCheckChange(path: Array<number>) {
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

	onActionChoose(event: SyntheticMouseEvent, functionName: string) {
		this.onInterpretationChoose(event, functionName);
	}

	onInterpretationChoose(event: SyntheticMouseEvent, functionName: string) {
		const rawData = {};
		rawData.lastStrokes = this.props.lastStrokes;
		if (this.props.selectedStrokes.length > 0) {
			rawData.selectedStrokes = this.props.selectedStrokes;
		}
		Object.assign(rawData, this.props.jsonTree);
		const values = map(this.state.checkedPaths, checkedPath =>
			reduce(checkedPath, (value, key) => value[key], rawData));
		this.props.onInterpretationChoose(event, functionName, values);
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
				{...this.props}
				contentLabel="I am required by a11y"
			>
				<ActionChooser
					onActionChoose={this.onActionChoose}
				/>
				<TreeMenu
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
