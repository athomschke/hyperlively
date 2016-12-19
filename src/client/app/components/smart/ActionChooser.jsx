import React, { Component, PropTypes } from 'react';
import actions from 'actions/actions';
import HoverList from 'components/smart/HoverList';
import Modal from 'react-modal';

export default class ActionChooser extends Component {

	static propTypes = {
		isOpen: PropTypes.bool,
		onActionChoose: PropTypes.func
	};

	static defaultProps = {
		isOpen: false,
		onActionChoose: () => {}
	}

	render() {
		return (<Modal ref='modal' {...this.props}
				contentLabel="I am required by a11y"
			>
				<HoverList ref='list'  {...this.props}
					onItemClick={this.props.onActionChoose.bind(this)}
					items={Object.keys(actions).map((actionName) => actionName)}
				/>
			</Modal>);
	}

}