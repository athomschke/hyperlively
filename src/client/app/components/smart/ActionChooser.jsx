import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { keys, map, cloneDeep, filter, isEqual, findIndex, splice } from 'lodash';

export default class ActionChooser extends Component {

	static propTypes = {
		isOpen: PropTypes.bool,
		onActionChoose: PropTypes.func,
		jsonTree: PropTypes.object,
		onCheckChange: PropTypes.func
	};

	static defaultProps = {
		isOpen: false,
		onActionChoose: () => {},
		jsonTree: {},
		onCheckChange: () => {}
	}

	componentDidMount () {
		this.setState({
			checkedPaths: []
		});
	}

	formatObject(anObject, optCheckedArrays) {
		let that = this;
		let checkedArrays = optCheckedArrays || [];
		return map(keys(anObject), (key) => {
			let matchingChecks = map(filter(checkedArrays, (checkedArray) => {
				return checkedArray[0] === key;
			}), (checkedArray) => {
				return checkedArray.slice(1);
			});
			if (anObject[key] instanceof Object) {
				return {
					label: key,
					children: that.formatObject(anObject[key], matchingChecks)
				};
			} else {
				return {
					label: `${key}: ${anObject[key]}`,
					checkbox: true,
					checked: matchingChecks.length > 0
				};
			}
		});
	}

	getPathToProperty(nestedArrayPath, arrayedJsonTree) {
		let node = {
			children: arrayedJsonTree
		};
		return map(nestedArrayPath, (index) => {
			node = node.children[index];
			return node.label.split(':')[0];
		});
	}

	onTreeNodeCheckChange(path) {
		let pathToProperty = this.getPathToProperty(path, this.getFormattedData());
		let checkedIndex = findIndex(this.state.checkedPaths, (checkedPath) => {
			return isEqual(checkedPath, pathToProperty);
		});
		if (checkedIndex >= 0) {
			this.setState({
				checkedPaths: this.state.checkedPaths.slice(0, checkedIndex).concat(this.state.checkedPaths.slice(checkedIndex + 1))
			});
		} else {
			this.setState({
				checkedPaths: this.state.checkedPaths.concat([pathToProperty])
			});
		}
		this.props.onCheckChange();
	}

	getFormattedData() {
		let rawData = cloneDeep(this.props.jsonTree);
		return this.formatObject(rawData, this.state && this.state.checkedPaths);
	}

	onActionChoose () {
		this.props.onActionChoose.apply(this, arguments);
		this.setState({
			checkedPaths: []
		});
	}

	render() {
		return (
			<Modal className='action-chooser' ref='modal' {...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList ref='list' {...this.props}
					onItemClick={() => {
						this.onActionChoose();
					}}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
				<TreeMenu ref='tree'
					data={this.getFormattedData()}
					onTreeNodeCheckChange={(path) => {
						this.onTreeNodeCheckChange(path);
					}}
				/>
			</Modal>);
	}

}