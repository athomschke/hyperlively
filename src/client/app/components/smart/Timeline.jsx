import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';
import { map, reduce, forEach, cloneDeep, flatten } from 'lodash';
import PlainDrawer from 'components/smart/PlainDrawer';
import SketchTransformer from 'components/smart/SketchTransformer';

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
		sketches: PropTypes.array
	};

	static defaultProps = {
		onChange: () => {},
		temporaryCallback: () => {},
		callbackEnabled: false,
		max: 0,
		value: 0,
		timeout: 1000,
		sketches: []
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
		let clonedStrokes = cloneDeep(strokes);
		let points = flatten(map(strokes, (stroke) => {
			return stroke.points || [];
		}));
		let minX = reduce(points, (min, point) => {
			return point.x < min ? point.x : min;
		}, points[0].x) || 0;
		let minY = reduce(points, (min, point) => {
			return point.y < min ? point.y : min;
		}, points[0].y) || 0;
		forEach(clonedStrokes, (stroke) => {
			forEach(stroke.points, (point) => {
				point.x -= minX;
				point.y -= minY;
			});
		});
		return clonedStrokes;
	}

	renderPreview() {
		return map(this.props.sketches, (sketch, id) => {
			return (<Canvas
				key={id}
				strokes={this.moveToOrigin(sketch.strokes)}
				finished={true}
			/>);
		});
	}

	render() {
		return (<div>
			<div ref="previewContainer">
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