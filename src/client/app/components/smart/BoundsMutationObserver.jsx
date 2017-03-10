import React, { PropTypes, Component } from 'react';
import { forEach } from 'lodash';

export default Wrapped => class extends Component {

	static propTypes = {
		observeMutations: PropTypes.bool,
		performAction: PropTypes.func,
		bounds: PropTypes.objectOf(PropTypes.number),
		strokes: PropTypes.arrayOf(PropTypes.object),
	};

	static defaultProps = {
		observeMutations: true,
		performAction: () => {},
		bounds: {
			x: 0,
			y: 0,
		},
		strokes: [],
	};

	observe() {
		const observer = new MutationObserver(this.onMutations.bind(this));
		observer.observe(this.wrappedComponent.node, {
			attributes: true,
		});
		this.setState({
			observer,
		});
	}

	ignore() {
		if (this.state.observer && this.state.observer.disconnect) {
			this.state.observer.disconnect();
		}
		this.setState({
			observer: undefined,
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
				if (mutationRecord.attributeName === 'style') {
					const moveBy = {
						x: parseInt(this.wrappedComponent.node.style.left, 10) - this.props.bounds.x,
						y: parseInt(this.wrappedComponent.node.style.top, 10) - this.props.bounds.y,
					};
					if (moveBy.x !== 0 || moveBy.y !== 0) {
						this.boundsUpdatedWith(
								this.props.bounds.x,
								this.props.bounds.y,
								parseInt(this.wrappedComponent.node.style.left, 10),
								parseInt(this.wrappedComponent.node.style.top, 10),
						);
					}
				}
			});
		}
	}

	render() {
		return (<Wrapped
			ref={(wrapped) => { this.wrappedComponent = wrapped; }}
			{...this.props}
		/>);
	}
};
