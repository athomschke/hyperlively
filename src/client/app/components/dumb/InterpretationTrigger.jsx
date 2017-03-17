// @flow
import React, { PureComponent } from 'react';

export default class InterpretationTrigger extends PureComponent {
	static propTypes = {
		onHandwritingRecognitionClick: React.PropTypes.func,
	}

	static defaultProps = {
		onHandwritingRecognitionClick: () => {},
	}

	constructor() {
		super();
		this.onHandwritingRecognitionClick = this.onHandwritingRecognitionClick.bind(this);
	}

	onHandwritingRecognitionClick() {
		this.props.onHandwritingRecognitionClick();
	}

	render() {
		return (<button
			onClick={this.onHandwritingRecognitionClick}
		>Show Interpreter</button>);
	}
}
