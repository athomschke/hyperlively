import React, { Component, PropTypes } from 'react';

const DragHandler = (Wrapped) => class extends React.Component {

	static propTypes = {
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func
	};

	static defaultProps = {
		onDragStart: () => {},
		onDrag: () => {},
		onDragEnd: () => {}
	}

	constructor(props) {
		super(props);
		this.onMouseUp = this.onMouseUp.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
		this.state = {
			mousePressed: false
		}
	}

	onMouseDown(evt) {
		evt.persist();
		this.setState({
			mousePressed: true
		}, this.props.onDragStart.bind(this, evt))
	}

	onMouseMove(evt) {
		if (this.state.mousePressed) {
			this.props.onDrag(evt);
		}
	}

	onMouseUp(evt) {
		if (this.state.mousePressed) {
			this.props.onDragEnd(evt);
			this.setState({
				mousePressed: false
			})
		}
	}

	render() {
		return (
			<div {...this.props} {...this.state}
				ref='node'
				onMouseUp={this.onMouseUp.bind(this)}
				onMouseMove={this.onMouseMove.bind(this)}
				onMouseDown={this.onMouseDown.bind(this)}
			><Wrapped {...this.props}/></div>)
	}
}

export default DragHandler