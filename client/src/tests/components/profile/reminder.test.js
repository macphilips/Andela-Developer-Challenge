import Reminder from '../../../component/profile/reminder';

test('should render ButtonLoader', () => {
  const updateReminder = jest.fn();
  const wrapper = mount(
    <Reminder
      reminder={{}}
      updatingSettings={true}
      updateReminder={updateReminder}/>
  );

  wrapper.find('#from')
    .simulate('change', {
      target: {
        name: 'enabled',
        value: false,
      }
    });
  wrapper.setProps({
    reminder: {
      time: '00:09',
      enabled: true,
      from: 'MONDAY',
      to: 'FRIDAY',
    }
  });
  wrapper.update();
  const instance = wrapper.instance();
  instance.forceUpdate();

  wrapper.find('[type="button"]')
    .simulate('click');
  expect(updateReminder)
    .toBeCalled();
  instance.showReminderSettings(false);
  instance.showReminderSettings(true);
});
