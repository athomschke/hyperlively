import React, {Component, PropTypes} from 'react';
import StrokeDrawer from 'components/smart/StrokeDrawer';
import SketchTransformer from 'components/smart/SketchTransformer';
import { OFFSET } from 'constants/canvas';
import { map, last, forEach } from 'lodash';

let TransformedCanvas = SketchTransformer(StrokeDrawer)

export default class Desk extends Component {

	static propTypes = {
		sketches: PropTypes.array
	};

	static defaultProps = {
		sketches: []
	}

	renderCanvas(strokes, id, finished) {
		return <TransformedCanvas {...this.props}
			active={finished}
			strokes={strokes}
			finished={finished}
			offset={OFFSET}
			key={id}
		/>
	}

	renderSketchedCanvasses() {
		let that = this;
		return map(this.props.sketches, (sketch, id) => {
			return that.renderCanvas(sketch.strokes || [], id, true);
		})
	}

	renderPlaceholderCanvas() {
		let sketch = last(this.props.sketches);
		if ((!sketch || sketch.finished)) {
			return this.renderCanvas([], this.props.sketches.length, false);
		}
	}

	render() {
		return (<div>
			{this.renderSketchedCanvasses().concat(this.renderPlaceholderCanvas())}
		</div>)
	}

}