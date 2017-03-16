// @flow
import React, { PureComponent } from 'react';

type Props = {
	onHandwritingRecognitionClick: () => void,
}

export default class InterpretationTrigger extends PureComponent {
	static defaultProps = () => ({
		onClick: () => {},
	})

	props: Props

	render() {
		return (<button
			onClick={this.props.onHandwritingRecognitionClick}
		>Show Interpreter</button>);
	}
}
