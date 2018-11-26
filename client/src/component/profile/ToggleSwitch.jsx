import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ToggleSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: this.props.enabled
    };
  }

  updateState = (e) => {
    const data = {};
    data[e.target.name] = e.target.checked;
    this.props.onToggle(e.target.checked);
    this.setState({ ...data });
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ enabled: newProps.enabled });
  }

  render() {
    const { enabled } = this.state;
    return (
      <label htmlFor="switchCheck" className="switch switch-js">
        <input
          id="switchCheck"
          checked={enabled}
          onChange={this.updateState}
          data-action="enable-switch"
          data-model="enabled"
          name="enabled"
          type="checkbox"
        />
        <span className="slider" />
      </label>
    );
  }
}
ToggleSwitch.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

ToggleSwitch.defaultProps = {
  enabled: false,
};
