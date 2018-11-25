import EmptyList from '../../../component/entries/EmptyList';
import EntryListHeader from '../../../component/entries/EntryListHeader';
import FloatingButton from '../../../component/entries/FloatingButton';
import EntryListItem from '../../../component/entries/EntryListItem';
import CreateEntry from '../../../component/entries/CreateEntry';
import DeleteEntryDialog from '../../../component/entries/DeleteEntryDialog';
import ViewEntry from '../../../component/entries/ViewEntry';
import { EntryListPage } from '../../../component/entries/EntryListPage';

const longTitle = 'In Simulations, Apprenticeship, Partner work and beyond Andela, you will have multiple opportunities to work with front-end frameworks such as ReactJS. You\'ll be expected to understand the key technologies and concepts that power such technologies. You\'ll also be expected to demonstrate this understanding through contributing to projects you take on.';
const entry = {
  id: 1,
  content: '',
  lastModified: '',
  title: '',
};
const queryInfo = {
  page: 2,
  size: 2,
  total: 10,
};

test('should render DeleteDialog', () => {
  const props = {
    dismissModal: jest.fn(),
    deleteEntry: jest.fn(),
    showToast: jest.fn(),
    loading: false,
  };
  const wrapper = shallow(<DeleteEntryDialog {...props} />);
  wrapper.find('[data-action="ok"]')
    .simulate('click');
  wrapper.find('[data-dismiss="cancel"]')
    .simulate('click');
  wrapper.find('[data-dismiss="modal"]');

  expect(props.dismissModal)
    .toBeCalled();
  expect(props.deleteEntry)
    .toBeCalled();
  expect(props.dismissModal)
    .toBeCalled();
});

test('should render ViewEntry', () => {
  const props = {
    dismissModal: jest.fn(),
    entry,
  };
  const wrapper = shallow(<ViewEntry {...props} />);
  wrapper.find('[data-dismiss="modal"]')
    .simulate('click');

  expect(props.dismissModal)
    .toBeCalled();
});

test('should render EmptyList', () => {
  shallow(<EmptyList/>);
});

test('should render EntryListHeader', () => {
  const onPageChange = jest.fn();
  const onCreateEntryClicked = jest.fn();

  const props = {
    onPageChange,
    queryInfo,
    onCreateEntryClicked,
  };
  const wrapper = shallow(<EntryListHeader {...props}/>);
  wrapper.find('#addEntry')
    .simulate('click');
});

describe('EntryListItem', () => {
  let wrapper,
    dropdownMock,
    eventMock;
  beforeEach(() => {
    dropdownMock = jest.fn();
    wrapper = mount(
      <EntryListItem
        onDropdownItemClicked={dropdownMock} entry={entry}
      />
    );
    eventMock = {
      target: {
        matches: jest.fn(),
        getAttribute: jest.fn(),
        classList: {
          contains: jest.fn(),
          add: jest.fn(),
          remove: jest.fn(),
        }
      }
    };
  });
  test('should onDropdownItemClicked', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'dismissDropDownMenu');
    instance.forceUpdate();
    eventMock.target.getAttribute.mockReturnValueOnce('view');
    instance.onDropdownItemClicked(eventMock);
    expect(dropdownMock)
      .toBeCalled();
    expect(spy)
      .toBeCalled();
  });

  test('should handlerWindowClicked', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'dismissDropDownMenu');
    instance.forceUpdate();
    eventMock.target.matches.mockReturnValueOnce(true);
    instance.handlerWindowClicked(eventMock);
    expect(spy)
      .not
      .toBeCalled();

    eventMock.target.matches.mockReturnValueOnce(false);
    instance.handlerWindowClicked(eventMock);
    expect(spy)
      .toBeCalled();
  });

  test('should handle show drop down menu', () => {
    const event = {
      target: {
        ...eventMock.target,
        nextElementSibling: { ...eventMock.target }
      }
    };
    event.target.getAttribute.mockReturnValueOnce(true);
    wrapper.find('[data-action="dropdown-toggle"]')
      .simulate('click', event);

    expect(event.target.nextElementSibling.classList.add)
      .toBeCalledWith('open');
  });

  test('should handle hide drop down menu', () => {
    const event = {
      target: {
        ...eventMock.target,
        nextElementSibling: { ...eventMock.target }
      }
    };
    event.target.nextElementSibling.classList.contains.mockReturnValueOnce(true);
    wrapper.find('[data-action="dropdown-toggle"]')
      .simulate('click', event);

    expect(event.target.nextElementSibling.classList.remove)
      .toBeCalledWith('open');
  });

  test('should handleViewClicked', () => {
    wrapper.find('.entry')
      .simulate('click', eventMock);
    expect(dropdownMock)
      .toBeCalled();
  });
  test('should not handleViewClicked when it contains data-action attribute ', () => {
    eventMock.target.getAttribute.mockReturnValueOnce(true);
    wrapper.find('.entry')
      .simulate('click', eventMock);
    expect(dropdownMock)
      .not
      .toBeCalled();
  });
  test('should not handleViewClicked when it contains dropdown-toggle class', () => {
    eventMock.target.classList.contains.mockReturnValueOnce(true);
    wrapper.find('.entry')
      .simulate('click', eventMock);
    expect(dropdownMock)
      .not
      .toBeCalled();
  });
});


describe('FloatingButton', () => {
  let wrapper;
  beforeAll(() => {
    jest.useFakeTimers();
    wrapper = mount(<FloatingButton/>);
  });
  afterAll(() => {
    wrapper.unmount();
  });

  test('should render FloatingButton', () => {
    const instance = wrapper.instance();
    instance.forceUpdate();
    instance.handleScrollEvent();
    jest.runAllTimers();
    instance.handleScrollEvent();
  });
});

describe('CreateEntry', () => {
  test('should render CreateEntry create mode', () => {
    const props = {
      dismissModal: jest.fn(),
      mode: 'create',
      saveEntry: jest.fn(),
      entry,
      showToast: jest.fn(),
      loading: false
    };
    shallow(<CreateEntry {...props}/>);
  });
  let props,
    wrapper;
  beforeEach(() => {
    props = {
      dismissModal: jest.fn(),
      mode: 'edit',
      saveEntry: jest.fn(),
      entry,
      showToast: jest.fn(),
      loading: true
    };
    wrapper = shallow(<CreateEntry {...props}/>);
  });
  test('should close modal', () => {
    wrapper.find('.action-btn.close')
      .simulate('click', {
        target: {}
      });
    expect(props.dismissModal)
      .toBeCalled();
  });

  test('should create entry when provided with a valid input', () => {
    wrapper.find('.action-btn.close')
      .simulate('click', {
        target: {}
      });

    wrapper.find('[name=\'content\']')
      .simulate('change', {
        target: {
          name: 'content',
          value: 'Valid content'
        }
      });
    wrapper.find('.form-input.modal-header-input')
      .at(0)
      .simulate('change', {
        target: {
          name: 'title',
          value: 'Valid input'
        }
      });

    const instance = wrapper.instance();
    instance.forceUpdate();
    expect(instance.state.title)
      .toEqual('Valid input');
    expect(instance.state.content)
      .toEqual('Valid content');

    wrapper.find('[data-action="save"]')
      .simulate('click', {});
    expect(props.saveEntry)
      .toBeCalled();
  });

  test('should show toast when provided with invalid input', () => {
    wrapper.find('.form-input.modal-header-input')
      .at(0)
      .simulate('change', {
        target: {
          name: 'title',
          value: 'val'
        }
      });

    wrapper.find('[data-action="save"]')
      .simulate('click', {});

    wrapper.find('.form-input.modal-header-input')
      .at(0)
      .simulate('change', {
        target: {
          name: 'title',
          value: 'val$$%^&*@(@&*(#)(*&^&*@()'
        }
      });

    wrapper.find('[data-action="save"]')
      .simulate('click', {});

    wrapper.find('.form-input.modal-header-input')
      .at(0)
      .simulate('change', {
        target: {
          name: 'title',
          value: longTitle
        }
      });

    wrapper.find('[data-action="save"]')
      .simulate('click', {});


    wrapper.find('[name=\'content\']')
      .simulate('change', {
        target: {
          name: 'content',
          value: 'Va'
        }
      });

    wrapper.find('[data-action="save"]')
      .simulate('click', {});


    expect(props.showToast)
      .toBeCalled();

    expect(props.showToast.mock.calls)
      .toHaveLength(4);
  });
});

describe('EntryListPage', () => {
  test('', () => {
    const props = {
      getEntries: jest.fn(),
      updateEntry: jest.fn(),
      openModal: jest.fn(),
      dismissModal: jest.fn(),
      deleteEntry: jest.fn(),
      showToast: jest.fn(),
      createEntry: jest.fn(),
      entryList: [entry],
      authenticated: true,
      queryInfo,
    };
    const wrapper = shallow(<EntryListPage {...props}/>);
    const instance = wrapper.instance();
    expect(instance.openModal(''))
      .toEqual(null);
    instance.openCreateEntryModal();
    const defaultProps = {
      dismissModal: props.dismissModal,
      showToast: props.showToast,
      mode: 'create',
      saveEntry: props.createEntry,
    };
    const content = {
      component: CreateEntry,
      props: defaultProps,
    };
    expect(props.openModal)
      .toBeCalledWith(content);

    instance.openModal('edit', entry);

    // content = {
    //   component: CreateEntry,
    //   props: {
    //     ...defaultProps,
    //     ...{
    //       mode: 'edit',
    //       saveEntry: (data) => {
    //         props.updateEntry(data);
    //       },
    //       entry
    //     }
    //   },
    // };
    instance.openModal('view', entry);
    instance.openModal('delete', entry);
    expect(props.openModal)
      .toBeCalled();
  });
});
