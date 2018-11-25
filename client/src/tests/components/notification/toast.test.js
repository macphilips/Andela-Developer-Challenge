import { Toast } from '../../../component/notification/Toast';

test('should render Toast ', () => {
  const dismissAlert = jest.fn();
  const wrapper = shallow(<Toast show={true} text={''} type={'error'} title={''}
                                 dismissToast={dismissAlert}/>);

  wrapper.find('.title > .close-btn')
    .simulate('click');
  expect(dismissAlert)
    .toBeCalled();
});

test('should render Toast', () => {
  shallow(<Toast show={false}/>);
});
