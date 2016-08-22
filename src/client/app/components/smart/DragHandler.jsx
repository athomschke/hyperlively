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

	constructor(props) {
		super(props);
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
			this.props.onDrag(evt);
		}
	}

	onPointerUp(evt) {
		if (this.state.mousePressed) {
			this.props.onDragEnd(evt);
			this.setState({
				mousePressed: false
			});
		}
	}

	render() {
		return (
			<div
				ref='node'
				onMouseUp={this.props.cmdPressed ? () => {} : this.onMouseUp.bind(this)}
				onMouseMove={this.props.cmdPressed ? () => {} : this.onMouseMove.bind(this)}
				onMouseDown={this.props.cmdPressed ? () => {} : this.onMouseDown.bind(this)}
				onTouchStart={this.props.cmdPressed ? () => {} : this.onTouchStart.bind(this)}
				onTouchMove={this.props.cmdPressed ? () => {} : this.onTouchMove.bind(this)}
				onTouchEnd={this.props.cmdPressed ? () => {} : this.onTouchEnd.bind(this)}
			><Wrapped {...this.props}/></div>);
	}
};