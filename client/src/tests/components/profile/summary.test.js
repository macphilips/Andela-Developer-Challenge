import EntrySummary from '../../../component/profile/entrySummary';

test('should render ButtonLoader', () => {
  const summary = {
    count: 1,
    lastModified: ''
  };
  shallow(<EntrySummary summary={summary}/>);
});
