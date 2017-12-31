// @flow
import React, { PureComponent } from 'react';

type Props = {
	onHandwritingRecognitionClick: () => void;
}

export default class InterpretationTrigger extends PureComponent<Props> {
	static propTypes = {
		onHandwritingRecognitionClick: React.PropTypes.func,
	}

	static defaultProps = {
		onHandwritingRecognitionClick: () => {},
	}

	constructor() {
		super();
		(this:any).onHandwritingRecognitionClick = this.onHandwritingRecognitionClick.bind(this);
	}

	onHandwritingRecognitionClick() {
		this.props.onHandwritingRecognitionClick();
	}

	render() {
		return (<button
			onClick={this.onHandwritingRecognitionClick}
		>Recognize Handwriting</button>);
	}
}
