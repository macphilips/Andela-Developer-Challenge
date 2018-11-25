import { Alert } from '../../../component/notification/Alert';

test('should render ButtonLoader', () => {
  const dismissAlert = jest.fn();
  const wrapper = shallow(<Alert show={true} type={'error'} text={''}
                                 dismissAlert={dismissAlert}/>);

  wrapper.find('.close-btn')
    .simulate('click');
  expect(dismissAlert)
    .toBeCalled();
  wrapper.unmount();
});
