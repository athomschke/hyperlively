import React from 'react';
import { connect } from 'react-redux';
import { togglePloma } from 'actions/configuring';
import Ploma from 'components/dumb/Ploma'

const mapStateToProps = (state) => {
  return {
    checked: state.ploma.usePloma
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (bool) => {
      dispatch(togglePloma(bool))
    }
  }
}

const Settings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Ploma)

export default Settings;