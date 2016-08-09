import React, {PropTypes, Component} from 'react';
import { forEach } from 'lodash';

'use strict';

export default (Wrapped) => class extends Component {

	static propTypes = {
		onBoundsUpdate: PropTypes.func,
		bounds: PropTypes.object
	};

	static defaultProps = {
		onBoundsUpdate: () => {},
		bounds: {
			x: 0,
			y: 0
		}
	};
	
	componentDidMount() {
		let observer = new MutationObserver(this.onMutations.bind(this));
		observer.observe(this.refs.wrapped.refs.node, {
			attributes: true
		});
		this.setState({
			observer: observer
		});
	}

	componentWillUnmount() {
		this.state.observer.disconnect();
	}

	onMutations(mutationRecords) {
		forEach(mutationRecords, (mutationRecord) => {
			if (mutationRecord['attributeName'] === 'style') {
				let moveBy = {
					x: parseInt(this.refs.wrapped.refs.node.style.left) - this.props.bounds.x,
					y: parseInt(this.refs.wrapped.refs.node.style.top) - this.props.bounds.y
				};
				if (moveBy.x !== 0 || moveBy.y !== 0) {
					this.props.onBoundsUpdate(this.props.strokes, moveBy);
				}
			}
		});
	}

	render() {
		return <Wrapped ref='wrapped' {...this.props} />;
	}
};