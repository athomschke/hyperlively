// @flow
import React, { PureComponent } from 'react';

export type LabelledBoxProps = {
		label: string;
		checked: boolean;
		onChange: (_checked: boolean) => void;
}

export default class LabelledBox extends PureComponent<LabelledBoxProps> {
	props: LabelledBoxProps;

	render() {
		const { onChange, checked } = this.props;

		const handleOnClick = () => {
			onChange(!checked);
		};

		return (
			<div>
				<input
					type="checkbox"
					checked={checked}
					onClick={handleOnClick}
					onChange={() => {}}
				/>
				<span>
					{this.props.label}
				</span>
			</div>
		);
	}
}
