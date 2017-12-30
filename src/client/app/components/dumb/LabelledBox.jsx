// @flow
import React, { PureComponent, PropTypes } from 'react';
import Checkbox from 'components/smart/Checkbox';

export default class LabelledBox extends PureComponent {

	static propTypes = {
		label: PropTypes.string,
	};

	static defaultProps = {
		label: '',
	};

	render() {
		return (
			<div>
				<Checkbox
					{...this.props}
				/>
				<span>{this.props.label}</span>
			</div>
		);
	}

}
