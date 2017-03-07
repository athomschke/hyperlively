export function point(x, y, optTimestamp) {
	return {
		x,
		y,
		timeStamp: optTimestamp || Date.now(),
	};
}

export function event(x, y, optTimestamp) {
	return {
		pageX: x,
		pageY: y,
		timeStamp: optTimestamp || Date.now(),
	};
}
