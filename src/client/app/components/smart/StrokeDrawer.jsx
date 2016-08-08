import React, {Component, PropTypes} from 'react';
import Canvas from 'components/dumb/Canvas'
import BoundsMutationObserver from 'components/smart/BoundsMutationObserver'
import PlomaDrawer from 'components/smart/PlomaDrawer'
import PlainDrawer from 'components/smart/PlainDrawer'

'use strict'

let PlomaCanvas = PlomaDrawer(BoundsMutationObserver(Canvas));
let PlainCanvas = PlainDrawer(BoundsMutationObserver(Canvas));

export default class StrokeDrawer extends Component {

	static propTypes = {
		usePloma: PropTypes.bool
	};

	static defaultProps = {
		usePloma: true
	};

	render() {
		return this.props.usePloma ? 
			<PlomaCanvas ref="canvas" {...this.props} /> :
			<PlainCanvas ref="canvas" {...this.props} />
	}

}