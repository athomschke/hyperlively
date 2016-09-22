import React, { Component, PropTypes } from 'react';
import { invokeMap, map, find } from 'lodash';

export default (Wrapped) => class extends Component {

	static propTypes =  {
		onMove: PropTypes.func
	};

	static defaultProps = {
		onMove: () => {}
	};

	onTextDetected(candidates) {
		if(invokeMap(map(candidates, 'label'), 'toLowerCase').indexOf('o') >= 0) {
			console.log('circle');
			return 'circle';
		}
	}

	findArrowInCandidates(candidates) {
		return find(candidates, (candidate) => {
			return candidate.label && candidate.label.indexOf('arrow') >= 0;
		});
	}

	onShapeDetected(candidates) {
		let arrowCandidate = this.findArrowInCandidates(candidates);
		if ( arrowCandidate ) {
			let start = arrowCandidate.primitives[0].firstPoint;
			let end = arrowCandidate.primitives[0].lastPoint;
			this.props.onMove({
				x: end.x - start.x,
				y: end.y - start.y
			});
		}
	}

	render() {
		return (<Wrapped {...this.props}
			onTextDetected={this.onTextDetected.bind(this)}
			onShapeDetected={this.onShapeDetected.bind(this)}
		></Wrapped>);
	}
};