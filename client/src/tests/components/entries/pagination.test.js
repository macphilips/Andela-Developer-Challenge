import BottomPagination from '../../../component/entries/BottomPagination';
import { TopPagination } from '../../../component/entries/TopPagination';

const queryInfo = {
  page: 2,
  size: 2,
  total: 10,
};
describe('', () => {
  test('', () => {
    const onPageChangeMock = jest.fn();
    const getAttribute = jest.fn();
    getAttribute.mockReturnValueOnce('next');
    getAttribute.mockReturnValueOnce('prev');
    const wrapper = shallow(<TopPagination
      onPageChange={onPageChangeMock}
      queryInfo={queryInfo}/>);
    const mock = {
      target: {
        getAttribute
      }
    };
    wrapper.find('.next-js').simulate('click', mock);
    expect(onPageChangeMock).toBeCalled();
    expect(getAttribute)
      .toBeCalled();

    wrapper.find('.prev-js').simulate('click', mock);
    expect(onPageChangeMock).toBeCalled();
    expect(getAttribute)
      .toBeCalled();
    expect(getAttribute.mock.calls.length)
      .toBe(2);
    expect(onPageChangeMock.mock.calls.length)
      .toBe(2);
  });
});

describe('BottomPagination', () => {
  test('', () => {
    const onPageChangeMock = jest.fn();
    const getAttribute = jest.fn();
    getAttribute.mockReturnValueOnce('next');
    getAttribute.mockReturnValueOnce('prev');
    const wrapper = shallow(<BottomPagination
      onPageChange={onPageChangeMock}
      queryInfo={queryInfo}/>);
    const mock = {
      target: {
        getAttribute
      }
    };
    wrapper.find('.next-js').simulate('click', mock);
    expect(onPageChangeMock).toBeCalled();
    expect(getAttribute)
      .toBeCalled();

    wrapper.find('.prev-js').simulate('click', mock);
    expect(onPageChangeMock).toBeCalled();
    expect(getAttribute)
      .toBeCalled();
    expect(getAttribute.mock.calls.length)
      .toBe(2);
    expect(onPageChangeMock.mock.calls.length)
      .toBe(2);
  });
});
