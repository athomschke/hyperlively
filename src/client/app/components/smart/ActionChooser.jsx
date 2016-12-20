import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';
import { TreeMenu } from 'react-tree-menu';
import { keys, map, cloneDeep } from 'lodash';

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

	formatObject(anObject) {
		let that = this;
		return map(keys(anObject), (key) => {
			if (anObject[key] instanceof Object) {
				return {
					label: key,
					children: that.formatObject(anObject[key])
				};
			} else {
				return {
					label: key,
					checkbox: true
				};
			}
		});
	}

	getFormattedData() {
		let rawData = cloneDeep(this.props.jsonTree);
		return this.formatObject(rawData);
	}

	render() {
		return (<Modal ref='modal' {...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList ref='list'  {...this.props}
					onItemClick={this.props.onActionChoose.bind(this)}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
				<TreeMenu ref='tree'
					data={this.getFormattedData()}
					onTreeNodeCheckChange={this.props.onCheckChange}
				/>
			</Modal>);
	}

}