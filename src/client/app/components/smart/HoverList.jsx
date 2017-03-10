import React, { Component, PropTypes } from 'react';
import { map } from 'lodash';
import { hoverList } from 'stylesheets/components/smart/hoverList.scss';

export default class HoverList extends Component {

	static propTypes = {
		onItemClick: PropTypes.func,
		items: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		onItemClick: () => {},
		items: [],
	};

	renderChildren() {
		return map(this.props.items, (aText, index) => (
			<li key={index} >
				<button
					onClick={(event) => {
						this.props.onItemClick(event, aText);
					}}
				>{aText}</button>
			</li>));
	}

	render() {
		return (<ul className={`list-view ${hoverList}`} >
			{this.renderChildren()}
		</ul>);
	}
}
