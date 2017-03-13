// @flow
import React, { Component, PropTypes } from 'react';
import { type SyntheticTouchEvent, type SyntheticMouseEvent } from 'flow-bin';

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

	state: {
		mousePressed: boolean,
	}

	componentDidMount() {
		this.state = {
			mousePressed: false,
		};
	}

	onTouchStart(evt: SyntheticTouchEvent) {
		evt.persist();
		return this.onPointerDown(evt.changedTouches[0]);
	}

	onTouchMove(evt: SyntheticTouchEvent) {
		return this.onPointerMove(evt.changedTouches[0]);
	}

	onTouchEnd(evt: SyntheticTouchEvent) {
		return this.onPointerUp(evt.changedTouches[0]);
	}

	onMouseDown(evt: SyntheticMouseEvent) {
		evt.persist();
		this.onPointerDown(evt);
	}

	onMouseMove(evt: SyntheticMouseEvent) {
		this.onPointerMove(evt);
	}

	onMouseUp(evt: SyntheticMouseEvent) {
		this.onPointerUp(evt);
	}

	onPointerDown(evt: SyntheticMouseEvent | SyntheticTouchEvent) {
		this.setState({
			mousePressed: true,
		}, this.props.onDragStart.bind(this, evt));
	}

	onPointerMove(evt: SyntheticMouseEvent | SyntheticTouchEvent) {
		if (this.state.mousePressed) {
			this.props.onDrag.call(this, evt);
		}
	}

	onPointerUp(evt: SyntheticMouseEvent | SyntheticTouchEvent) {
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
