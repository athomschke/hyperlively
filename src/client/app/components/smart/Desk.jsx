import React, {Component, PropTypes} from 'react';
import { OFFSET } from 'constants/canvas';
import { map, last, filter } from 'lodash';

export default (Wrapped) => class extends Component {

	static propTypes = {
		sketches: PropTypes.array
	};

	static defaultProps = {
		sketches: []
	}

	renderCanvas(strokes, id, finished) {
		return (<Wrapped {...this.props}
			active={this.props.cmdPressed}
			strokes={strokes}
			finished={finished}
			offset={OFFSET}
			key={id}
		/>);
	}

	visibleStrokesInSketch(sketch) {
		return filter(sketch.strokes || [], (stroke) => !stroke.hidden);
	}

	renderSketchedCanvasses() {
		let that = this;
		return map(this.props.sketches, (sketch, id) => {
			let strokesToRender = this.visibleStrokesInSketch(sketch);
			if (strokesToRender.length > 0) {
				return that.renderCanvas(strokesToRender, id, true);
			}
		});
	}

	renderPlaceholderCanvas() {
		let sketch = last(this.props.sketches);
		if ((!sketch || !sketch.strokes || sketch.finished)) {
			return this.renderCanvas([], this.props.sketches.length, false);
		}
	}

	getStyle() {
		return {
			width: this.props.width,
			height: this.props.height,
			position: 'absolute',
			top: 0,
			left: 0,
			backgroundColor: this.props.paperColor
		};
	}

	render() {
		return (<div
			id='desk'
			style={this.getStyle()}>
			{this.renderSketchedCanvasses().concat(this.renderPlaceholderCanvas())}
		</div>);
	}

};