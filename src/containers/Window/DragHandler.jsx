// @flow
import * as React from 'react';

type SyntheticPointerEvent = SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>;

export type DragHandlerProps<P> = P & {
	onDragStart: (_evt: SyntheticPointerEvent) => void;
	onDrag: (_evt: SyntheticPointerEvent) => {};
	onDragEnd: (_evt: SyntheticPointerEvent) => {};
	cmdPressed: boolean;
}

type State = {
	mousePressed: boolean;
}

export default (Wrapped: React.ComponentType<DragHandlerProps<any>>) => class extends React.PureComponent<DragHandlerProps<any>, State> {
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

	state: State;

	componentDidMount() {
		this.state = {
			mousePressed: false,
		};
	}

	onTouchStart(evt: SyntheticTouchEvent<HTMLElement>) {
		evt.persist();
		return this.onPointerDown(evt.changedTouches[0]);
	}

	onTouchMove(evt: SyntheticTouchEvent<HTMLElement>) {
		return this.onPointerMove(evt.changedTouches[0]);
	}

	onTouchEnd(evt: SyntheticTouchEvent<HTMLElement>) {
		return this.onPointerUp(evt.changedTouches[0]);
	}

	onMouseDown(evt: SyntheticMouseEvent<HTMLElement>) {
		evt.persist();
		this.onPointerDown(evt);
	}

	onMouseMove(evt: SyntheticMouseEvent<HTMLElement>) {
		this.onPointerMove(evt);
	}

	onMouseUp(evt: SyntheticMouseEvent<HTMLElement>) {
		this.onPointerUp(evt);
	}

	onPointerDown(evt: SyntheticPointerEvent) {
		this.setState({
			mousePressed: true,
		}, this.props.onDragStart.bind(this, evt));
	}

	onPointerMove(evt: SyntheticPointerEvent) {
		if (this.state.mousePressed) {
			this.props.onDrag.call(this, evt);
		}
	}

	onPointerUp(evt: SyntheticPointerEvent) {
		if (this.state.mousePressed) {
			this.props.onDragEnd.call(this, evt);
			this.setState({
				mousePressed: false,
			});
		}
	}

	props: DragHandlerProps<any>;

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
			<div {...callbacks}>
				<Wrapped {...this.props} />
			</div>);
	}
};
