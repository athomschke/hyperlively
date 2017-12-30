// @flow
import React, { PureComponent, PropTypes } from 'react';
import { type SyntheticTouchEvent, type SyntheticMouseEvent } from 'flow-bin';
import type { Component } from 'react-flow-types';

export default (Wrapped: Component<Object>) => class extends PureComponent {

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
		(this:any).onMouseUp = this.onMouseUp.bind(this);
		(this:any).onMouseMove = this.onMouseMove.bind(this);
		(this:any).onMouseDown = this.onMouseDown.bind(this);
		(this:any).onTouchStart = this.onTouchStart.bind(this);
		(this:any).onTouchMove = this.onTouchMove.bind(this);
		(this:any).onTouchEnd = this.onTouchEnd.bind(this);
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
