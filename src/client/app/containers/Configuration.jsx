import { connect } from 'react-redux';
import React from 'react';
import { updateThreshold } from 'actions/configuring';
import { Slider } from 'reactrangeslider';

let ThresholdSlider = ({ threshold, max, updateThreshold }) => {
  return (<Slider
    onChange={updateThreshold}
    min={0}
    max={max}
    value={threshold}
  ></Slider>)
}

const mapStateToProps = (state) => {
  return {
    threshold: state.threshold,
    max: 5000
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateThreshold: (newThreshold) => {
      return dispatch(updateThreshold(newThreshold))
    }
  }
}

ThresholdSlider = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThresholdSlider)

export default ThresholdSlider