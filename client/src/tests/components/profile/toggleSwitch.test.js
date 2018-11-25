import ToggleSwitch from '../../../component/profile/ToggleSwitch';

test('should render ButtonLoader', () => {
  const onToggle = jest.fn();
  const wrapper = shallow(<ToggleSwitch onToggle={onToggle} enabled={false}/>);

  wrapper.find('[name="enabled"]')
    .simulate('change', {
      target: {
        name: 'enabled',
        checked: true,
      }
    });
  expect(onToggle)
    .toBeCalled();
});
