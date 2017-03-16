// @flow
import React, { PureComponent, PropTypes } from 'react';
import { map } from 'lodash';
import { hoverList } from 'stylesheets/components/smart/hoverList.scss';
import { type SyntheticMouseEvent } from 'flow-bin';

export default class HoverList extends PureComponent {

	static propTypes = {
		onItemClick: PropTypes.func,
		items: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		onItemClick: () => {},
		items: [],
	};

	handleItemClick(event: SyntheticMouseEvent, aText: string) {
		this.props.onItemClick(event, aText);
	}

	renderChildren() {
		return map(this.props.items, (aText, index) => (
			<li key={index} >
				<button
					onClick={(event) => {
						this.handleItemClick(event, aText);
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
