import { connect } from 'react-redux';
import React from 'react';
import { updateThreshold } from 'actions/configuring';
import { MIN_THRESHOLD, MAX_THRESHOLD } from 'constants/drawing';
import { Slider } from 'reactrangeslider';

const mapStateToProps = (state) => {
  return {
    value: Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, state.threshold)),
    max: MAX_THRESHOLD,
    min: MIN_THRESHOLD
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (newThreshold) => {
      dispatch(updateThreshold(newThreshold))
    }
  }
}

let ThresholdSlider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider)

export default ThresholdSlider