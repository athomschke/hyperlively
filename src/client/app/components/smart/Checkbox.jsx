// @flow
import React, { PureComponent } from 'react';

type Props = {
	onChange: (_checked: boolean) => void;
	checked: boolean;
}

export default class Checkbox extends PureComponent<Props> {
	static defaultProps = {
		onChange: () => {},
		checked: true,
	};

	constructor() {
		super();
		(this:any).handleOnClick = this.handleOnClick.bind(this);
	}

	props: Props;

	handleOnClick() {
		this.props.onChange(!this.props.checked);
	}

	render() {
		return (
			<input
				type="checkbox"
				checked={this.props.checked}
				onClick={this.handleOnClick}
				onChange={() => {}}
			/>
		);
	}

}
