import React, { Component, PropTypes } from 'react';

export default (Wrapped) => class extends Component {

	static propTypes = {
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func,
		cmdPressed: PropTypes.bool
	};

	static defaultProps = {
		onDragStart: () => {},
		onDrag: () => {},
		onDragEnd: () => {},
		cmdPressed: false
	}
	
	componentDidMount() {
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.state = {
			mousePressed: false
		};
	}

	onTouchStart(evt) {
		evt.persist();
		return this.onPointerDown(evt.changedTouches[0]);
	}

	onTouchMove(evt) {
		return this.onPointerMove(evt.changedTouches[0]);
	}

	onTouchEnd(evt) {
		return this.onPointerUp(evt.changedTouches[0]);
	}

	onMouseDown(evt) {
		evt.persist();
		this.onPointerDown(evt);
	}

	onMouseMove(evt) {
		this.onPointerMove(evt);
	}

	onMouseUp(evt) {
		this.onPointerUp(evt);
	}

	onPointerDown(evt) {
		this.setState({
			mousePressed: true
		}, this.props.onDragStart.bind(this, evt));
	}

	onPointerMove(evt) {
		if (this.state.mousePressed) {
			this.props.onDrag.call(this, evt);
		}
	}

	onPointerUp(evt) {
		if (this.state.mousePressed) {
			this.props.onDragEnd.call(this, evt);
			this.setState({
				mousePressed: false
			});
		}
	}

	render() {
		let callbacks = this.props.cmdPressed ? {} : {
			onMouseUp: this.onMouseUp.bind(this),
			onMouseMove: this.onMouseMove.bind(this),
			onMouseDown: this.onMouseDown.bind(this),
			onTouchStart: this.onTouchStart.bind(this),
			onTouchMove: this.onTouchMove.bind(this),
			onTouchEnd: this.onTouchEnd.bind(this)
		};
		return (
			<div ref='node' {...callbacks} ><Wrapped {...this.props}/></div>);
	}
};