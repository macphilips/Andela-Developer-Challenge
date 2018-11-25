import App from '../App';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import Modal from '../component/modal/index';
import Body from '../component/Body';
import Toast from '../component/notification/Toast';

test('', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(Navbar)).toHaveLength(1);
  expect(wrapper.find(Footer)).toHaveLength(1);
  expect(wrapper.find(Modal)).toHaveLength(1);
  expect(wrapper.find(Toast)).toHaveLength(1);
  expect(wrapper.find(Body)).toHaveLength(1);
});
