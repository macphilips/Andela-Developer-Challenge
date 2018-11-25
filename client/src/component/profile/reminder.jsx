import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ToggleSwitch from './ToggleSwitch';
import TimeSwitcher from './TimeSwitcher';
import ButtonLoader from '../ButtonLoader';
import { getFieldData } from '../../utils/index';
import { reminderPropType } from '../propsValidator';

export default class Reminder extends Component {
  constructor(props) {
    super(props);
    this.view = React.createRef();
    this.state = {
      to: '',
      from: '',
      time: '',
      enabled: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const { reminder } = newProps;
    if (reminder) {
      this.setState({ ...reminder });
    }
  }

  updateState = (e) => {
    const data = getFieldData(e);
    this.setState({ ...data });
  };

  /**
   *
   * @param show {boolean}
   */
  showReminderSettings = (show) => {
    const reminderSettingsView = this.view.current.querySelector('.reminder-setting-js');
    if (show) {
      reminderSettingsView.classList.remove('hide-reminder-settings');
    } else {
      reminderSettingsView.classList.add('hide-reminder-settings');
    }
  };

  updateReminderHandler = () => {
    const {
      from, to, time, enabled
    } = this.state;

    const [hours, minutes] = time.split(':');

    this.props.updateReminder({
      from,
      time: `${hours}:${minutes}`,
      to,
      enabled
    });
  };

  render() {
    const {
      to, from, time, enabled
    } = this.state;
    return (
      <section ref={this.view} id="reminder">
        <div className="section-title">
          <span>Reminder Settings</span>
        </div>
        <hr/>
        <div className="section-content">
          <form id="reminderForm" name="reminderForm">
            <div className="enable-reminder">
              <div>Turn on reminder notification?</div>
              <div>
                <span className="label">No</span>
                <ToggleSwitch
                  enabled={enabled}
                  onToggle={this.showReminderSettings}
                />
                <span className="label">Yes</span>
              </div>
            </div>
            <div className={`reminder-setting-js ${(enabled) ? '' : 'hide-reminder-settings'}`}>
              <div className="sub-title">
                <span>Set daily reminder</span>
              </div>
              <div className="row-col-2">
                <div>
                  <label htmlFor="from">
                    FROM
                    <select
                      value={from}
                      onChange={this.updateState}
                      data-model="from"
                      className="form-input"
                      id="from"
                      name="from"
                      required
                    >
                      <option disabled>From</option>
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label htmlFor="to">
                    TO
                    <select
                      value={to}
                      onChange={this.updateState}
                      data-model="to"
                      className="form-input"
                      id="to"
                      name="to"
                      required
                    >
                      <option disabled>To</option>
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </select>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="timeSwitcher" className="show-on-mobile">TIME</label>
                {time.length && (
                  <TimeSwitcher
                    id="timeSwitcher"
                    time={time}
                    updateTime={(result) => {
                      this.setState({ time: `${result.hours}:${result.minutes}` });
                    }}
                  />
                )}
              </div>
              <div className="btn-container">
                <button
                  data-action="reminder"
                  onClick={this.updateReminderHandler}
                  type="button"
                  className="btn right"
                >
                  {!this.props.updatingSettings && <span>Update Reminder</span>}
                  {this.props.updatingSettings && <ButtonLoader/>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

Reminder.propTypes = {
  updatingSettings: PropTypes.bool.isRequired,
  updateReminder: PropTypes.func.isRequired,
  reminder: reminderPropType.isRequired,
};

Reminder.defaultProps = {};
