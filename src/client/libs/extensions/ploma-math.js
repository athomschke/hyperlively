var plomaInternalMath = {};
plomaInternalMath.random = () => {
	return window.uniquePaperFactor || 1;
}
plomaInternalMath.min = Math.min;
plomaInternalMath.max = Math.max;
plomaInternalMath.sqrt = Math.sqrt;
plomaInternalMath.round = Math.round;
plomaInternalMath.floor = Math.floor;
plomaInternalMath.abs = Math.abs;
plomaInternalMath.ceil = Math.ceil;

module.exports = plomaInternalMath;