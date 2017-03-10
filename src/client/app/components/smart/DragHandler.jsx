import React, { Component, PropTypes } from 'react';

export default Wrapped => class extends Component {

	static propTypes = {
		onDragStart: PropTypes.func,
		onDrag: PropTypes.func,
		onDragEnd: PropTypes.func,
		cmdPressed: PropTypes.bool,
	};

	static defaultProps = {
		onDragStart: () => {},
		onDrag: () => {},
		onDragEnd: () => {},
		cmdPressed: false,
	}

	constructor() {
		super();
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);
	}

	componentDidMount() {
		this.state = {
			mousePressed: false,
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
			mousePressed: true,
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
				mousePressed: false,
			});
		}
	}

	render() {
		const callbacks = this.props.cmdPressed ? {} : {
			onMouseUp: this.onMouseUp,
			onMouseMove: this.onMouseMove,
			onMouseDown: this.onMouseDown,
			onTouchStart: this.onTouchStart,
			onTouchMove: this.onTouchMove,
			onTouchEnd: this.onTouchEnd,
		};
		return (
			<div {...callbacks} >
				<Wrapped {...this.props} />
			</div>);
	}
};
