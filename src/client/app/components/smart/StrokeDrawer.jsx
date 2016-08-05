import React, {Component, PropTypes} from 'react';
import Canvas from 'components/dumb/Canvas'
import PlomaDrawer from 'components/smart/PlomaDrawer'
import PlainDrawer from 'components/smart/PlainDrawer'

'use strict'

let PlomaCanvas = PlomaDrawer(Canvas);
let PlainCanvas = PlainDrawer(Canvas);

export default class StrokeDrawer extends Component {

	static propTypes = {
		usePloma: PropTypes.bool
	};

	static defaultProps = {
		usePloma: true
	};

	render() {
		let WrappedCanvas = this.props.usePloma ? PlomaCanvas : PlainCanvas;
		return <WrappedCanvas ref="canvas" {...this.props} />
	}

}