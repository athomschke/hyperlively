import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';
import { map, reduce, flatten } from 'lodash';
import PlainDrawer from 'components/smart/PlainDrawer';
import SketchTransformer from 'components/smart/SketchTransformer';
import { OFFSET } from 'constants/canvas';

'use strict';

let runningTimeout;

let Canvas = SketchTransformer(PlainDrawer);

export default class Timeline extends Component {

	static propTypes = {
		onChange: PropTypes.func,
		temporaryCallback: PropTypes.func,
		callbackEnabled: PropTypes.bool,
		max: PropTypes.number,
		value: PropTypes.number,
		timeout: PropTypes.number,
		sketches: PropTypes.array,
		sliderWidth: PropTypes.number,
		sliderHeight: PropTypes.number
	};

	static defaultProps = {
		onChange: () => {},
		temporaryCallback: () => {},
		callbackEnabled: false,
		max: 0,
		value: 0,
		timeout: 1000,
		sketches: [],
		sliderWidth: 0,
		sliderHeight: 80
	};

	componentDidMount() {
		this.setState({
			disableFunction: null
		});
	}

	resetState(boundDisableFunction) {
		boundDisableFunction && boundDisableFunction(true);
		runningTimeout = undefined;
		this.setState({
			disableFunction: null
		});
	}

	onSliderMove(newValue) {
		let disableFunction = this.state.disableFunction;
		if (this.props.callbackEnabled && !disableFunction) {
			this.props.temporaryCallback(false);
			disableFunction = this.props.temporaryCallback.bind(this, true);
		}
		if (runningTimeout) {
			clearTimeout(runningTimeout);
		}
		if (disableFunction) {
			runningTimeout = setTimeout(this.resetState.bind(this, disableFunction), this.props.timeout);
		}
		this.props.onChange(Math.min(this.props.max, Math.max(0, newValue)));
		this.setState({
			disableFunction: disableFunction
		});
	}

	onSliderStop() {
		if (runningTimeout) {
			this.resetState(this.state.disableFunction);
			clearTimeout(runningTimeout);
		}
	}

	getTrackStyle() {
		return {
			backgroundColor: 'rgba(0,0,0,0)',
			borderRadius: 3,
			height: 60
		};
	}

	getHandleStyle() {
		return {
			backgroundColor: 'rgba(0,0,0,0)',
			borderRadius: 3,
			height: 80
		};
	}

	getWrapperStyle() {
		return {
			height: 80
		};
	}

	moveToOrigin(strokes) {
		let points = flatten(map(strokes, (stroke) => {
			return stroke.points || [];
		}));
		let minX = reduce(points, (min, point) => {
			return point.x < min ? point.x : min;
		}, points[0].x) || 0;
		let minY = reduce(points, (min, point) => {
			return point.y < min ? point.y : min;
		}, points[0].y) || 0;
		return {
			x: minX,
			y: minY
		};
	}

	moveToTime(strokes) {
		return (this.props.sliderWidth * strokes[0].actionIndex) / this.props.max;
	}

	stretchToTime(strokes) {
		let pointCount = flatten(map(strokes, 'points')).length;
		return (this.props.sliderWidth * pointCount) / this.props.max;
	}

	renderPreview() {
		return map(this.props.sketches, (sketch, id) => {
			let moveBy = this.moveToOrigin(sketch.strokes);
			return (<div
				key={id}
				style={{
					position: 'absolute',
					top: -moveBy.y,
					left: -moveBy.x + this.moveToTime(sketch.strokes)
				}}>
				<Canvas
					offset={OFFSET}
					strokes={sketch.strokes}
					finished={true}
				/>
			</div>);
		});
	}

	render() {
		return (<div>
			<div ref="previewContainer"
				style={{
					pointerEvents: 'none'
				}}
			>
				{this.renderPreview()}
			</div>
			<Slider ref="slider"
				onChange={this.onSliderMove.bind(this)}
				afterChange={this.onSliderStop.bind(this)}
				disabled={this.props.max <= 0}
				min={0}
				max={this.props.max}
				value={this.props.value}
				trackStyle={this.getTrackStyle()}
				handleStyle={this.getHandleStyle()}
				wrapperStyle={this.getWrapperStyle()}
			/>
		</div>);
	}

}