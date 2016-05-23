import React from 'react';
import { connect } from 'react-redux';
import { togglePloma } from 'actions/index';
import Ploma from 'components/Ploma'

const mapStateToProps = (state) => {
  return {
    usePloma: state.ploma
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (bool) => {
      dispatch(togglePloma(bool))
    }
  }
}

const Settings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Ploma)

export default Settings;