import ModalWithStore, { Modal } from '../component/modal';

const dummyComponent = () => (<div>This is a dummy component</div>);

test('should render Footer', () => {
  const content = {
    component: dummyComponent,
    props: {}
  };
  shallow(<Modal show={true} content={content} loading={false}/>);
});
test('should render Footer with store', () => {
  const store = mockStore({
    entries: {},
    modal: {}
  });
  shallow(<ModalWithStore store={store}/>);
});
