export const defaultContext = () => ({
	drawImage: () => {},
	getImageData: () => ({ data: [] }),
	clearRect: () => {},
	fillRect: () => {},
	putImageData: () => {},
	beginPath: () => {},
	moveTo: () => {},
	lineTo: () => {},
	stroke: () => {},
	closePath: () => {},
});

export default (mock) => {
	HTMLCanvasElement.prototype.getContext = () => (mock);
};
