import { reduce, last, first, concat } from 'lodash'

let strokeFollowedSuit = (collectedSketches, stroke, threshold) => {
	return last(collectedSketches) &&
		last(last(collectedSketches).strokes) &&
		last(last(last(collectedSketches).strokes).points) &&
		last(stroke.points) &&
		first(stroke.points).timestamp - last(last(last(collectedSketches).strokes).points).timestamp <= threshold
}

export default function sketches(strokes = [], threshold = 0) {
	return reduce(strokes, (collectedSketches, stroke) => {
		if (strokeFollowedSuit(collectedSketches, stroke, threshold)) {
			last(collectedSketches).strokes.push(stroke);
			last(collectedSketches).finished = stroke.finished;
			return collectedSketches;
		} else {
			return concat(collectedSketches, [{
				strokes: [stroke],
				finished: stroke.finished
			}])
		}
	}, [])
}