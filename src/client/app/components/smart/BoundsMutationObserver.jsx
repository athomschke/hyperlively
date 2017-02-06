import React, {PropTypes, Component} from 'react';
import { forEach } from 'lodash';

'use strict';

export default (Wrapped) => class extends Component {

	static propTypes = {
		observeMutations: PropTypes.bool,
		performAction: PropTypes.func,
		bounds: PropTypes.object
	};

	static defaultProps = {
		observeMutations: true,
		performAction: () => {},
		bounds: {
			x: 0,
			y: 0
		}
	};

	observe() {
		let observer = new MutationObserver(this.onMutations.bind(this));
		observer.observe(this.refs.wrapped.refs.node, {
			attributes: true
		});
		this.setState({
			observer: observer
		});
	}

	ignore() {
		if (this.state.observer && this.state.observer.disconnect) {
			this.state.observer.disconnect();
		}
		this.setState({
			observer: undefined
		});
	}
	
	componentDidMount() {
		this.observe();
	}

	componentWillUnmount() {
		this.ignore();
	}

	boundsUpdatedWith(fromX, fromY, toX, toY) {
		this.props.performAction('updatePosition', this.props.strokes, fromX, fromY, toX, toY);
	}

	onMutations(mutationRecords) {
		if (this.props.observeMutations) {
			forEach(mutationRecords, (mutationRecord) => {
				if (mutationRecord['attributeName'] === 'style') {
					let moveBy = {
						x: parseInt(this.refs.wrapped.refs.node.style.left) - this.props.bounds.x,
						y: parseInt(this.refs.wrapped.refs.node.style.top) - this.props.bounds.y
					};
					if (moveBy.x !== 0 || moveBy.y !== 0) {
						this.boundsUpdatedWith(
								this.props.bounds.x,
								this.props.bounds.y,
								parseInt(this.refs.wrapped.refs.node.style.left),
								parseInt(this.refs.wrapped.refs.node.style.top)
						);
					}
				}
			});
		}
	}

	render() {
		return <Wrapped ref='wrapped' {...this.props} />;
	}
};