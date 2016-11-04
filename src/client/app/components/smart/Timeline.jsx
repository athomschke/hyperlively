import React, {Component, PropTypes} from 'react';
import { Slider } from 'reactrangeslider';
import { map, flatten, cloneDeep, forEach } from 'lodash';
import PlainDrawer from 'components/smart/PlainDrawer';
import SketchTransformer from 'components/smart/SketchTransformer';
import SketchFitter from 'components/smart/SketchFitter';

'use strict';

let runningTimeout;

let Canvas = SketchTransformer(SketchFitter(PlainDrawer));

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

	scaleToTime(strokes, width, height) {
		let points = flatten(map(strokes, 'points'));
		let maxX = Math.max.apply(this, map(points, 'x'));
		let minX = Math.min.apply(this, map(points, 'x'));
		let maxY = Math.max.apply(this, map(points, 'y'));
		let minY = Math.min.apply(this, map(points, 'y'));
		let scale = 1;
		scale = Math.min(scale, width/(maxX - minX));
		scale = Math.min(scale, height/(maxY - minY));
		if (scale < 1) {
			let clonedStrokes = cloneDeep(strokes);
			forEach(clonedStrokes, (clonedStroke) => {
				forEach(clonedStroke.points, (point) => {
					point.x = point.x * scale;
					point.y = point.y * scale;
				});
			});
			return clonedStrokes;
		} else {
			return strokes;
		}
	}

	getFittedWidth(strokes, sliderWidth, max) {
		if (max > 0) {
			return (sliderWidth * flatten(map(strokes, 'points')).length) / max;
		} else {
			return 0;
		}		
	}

	renderPreview() {
		return map(this.props.sketches, (sketch, id) => {
			let fittedWidth = this.getFittedWidth(sketch.strokes, this.props.sliderWidth, this.props.max);
			let strokes = this.scaleToTime(sketch.strokes, fittedWidth, this.props.sliderHeight);
			return (
				<Canvas {...this.props}
					key={id}
					strokes={strokes}
					fittedWidth={fittedWidth}
					fittedHeight={this.props.sliderHeight}
					finished={true}
					showBorder={true}
				/>);
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