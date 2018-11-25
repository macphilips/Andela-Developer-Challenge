import TimeSwitcher from '../../../component/profile/TimeSwitcher';


describe('TimeSwitch', () => {
  test('should render TimeSwitch ', () => {
    const updateTime = jest.fn();
    const getAttribute = jest.fn();
    const wrapper = mount(<TimeSwitcher updateTime={updateTime} time={'00:00'}/>);
    getAttribute.mockReturnValueOnce('minutes');
    wrapper.find('[name="hours"]')
      .simulate('change', {
        target: {
          getAttribute,
          name: 'hours',
          value: '23'
        }
      });
    getAttribute.mockReturnValueOnce('minutes');
    wrapper.find('[name="minutes"]')
      .simulate('change', {
        target: {
          getAttribute,
          name: 'minutes',
          value: '23'
        }
      });
    expect(updateTime)
      .toBeCalled();
    wrapper.find('[name="minutes"]')
      .simulate('blur', {
        target: {
          getAttribute,
          name: 'minutes',
          value: '23'
        }
      });
    wrapper.find('[name="minutes"]')
      .simulate('focus', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'minutes',
          value: '23'
        }
      });
    wrapper.find('[data-direction="up"]')
      .simulate('click', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'minutes',
          value: '23'
        }
      });
  });
  test('should render TimeSwitch', () => {
    const updateTime = jest.fn();
    const getAttribute = jest.fn();
    const wrapper = mount(<TimeSwitcher updateTime={updateTime} time={'00:00'}/>);
    getAttribute.mockReturnValueOnce('hours');
    wrapper.find('[name="hours"]')
      .simulate('change', {
        target: {
          getAttribute,
          name: 'hours',
          value: '23'
        }
      });
    getAttribute.mockReturnValueOnce('hours');
    wrapper.find('[name="minutes"]')
      .simulate('change', {
        target: {
          getAttribute,
          name: 'minutes',
          value: '23'
        }
      });
    expect(updateTime)
      .toBeCalled();
    wrapper.find('[name="hours"]')
      .simulate('blur', {
        target: {
          getAttribute,
          name: 'minutes',
          value: '23'
        }
      });
    wrapper.find('[name="hours"]')
      .simulate('focus', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'minutes',
          value: '23'
        }
      });
    wrapper.find('[data-direction="up"]')
      .simulate('click', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'minutes',
          value: '23'
        }
      });
    wrapper.find('[name="hours"]')
      .simulate('focus', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'hours',
          value: '23'
        }
      });
    wrapper.find('[data-direction="down"]')
      .simulate('click', {
        target: {
          getAttribute,
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
          name: 'minutes',
          value: '23'
        }
      });
  });
});
