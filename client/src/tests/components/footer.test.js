import Footers, { Footer } from '../../component/Footer';

test('should render Footer', () => {
  shallow(<Footer/>);
});
test('should render Footer with store', () => {
  const store = mockStore({ toolbar: { fixFooter: true } });
  shallow(<Footers store={store}/>);
});
