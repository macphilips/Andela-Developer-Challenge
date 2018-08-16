import { bindPropertiesToElement, htmlToElement } from '../utils/util';
import { paginationTemplate } from '../utils/templates';
import Event from '../utils/event';

export default class PaginationView {
  constructor() {
    this.data = null;
    this.viewElement = htmlToElement(paginationTemplate);
    this.onChangePage = new Event(this);
    const nextButton = this.viewElement.querySelector('[data-direction="next"]');
    const prevButton = this.viewElement.querySelector('[data-direction="prev"]');
    nextButton.onclick = this.handlePageChange();
    prevButton.onclick = this.handlePageChange();
  }

  render(data) {
    if (!data) return;
    this.data = data;
    const { totalEntries, page, size } = data;
    const start = ((page - 1) * size) + 1;
    let end = page * size;
    end = (end > totalEntries) ? totalEntries : end;
    const visibleEntries = `${start} - ${end}`;
    const element = this.viewElement.querySelector('[tc-data-page-index]');
    element.setAttribute('tc-data-page-index', page);
    bindPropertiesToElement(this.viewElement.querySelectorAll('[tc-data-model]'),
      { totalEntries, visibleEntries });
  }

  handlePageChange() {
    return (e) => {
      const { target } = e;
      const direction = target.getAttribute('data-direction');
      let page = parseInt(this.viewElement.querySelector('[tc-data-page-index]').getAttribute('tc-data-page-index'), 10);
      if (direction === 'next') {
        page += 1;
      } else {
        page -= 1;
      }
      this.onChangePage.notify({ page });
    };
  }

  getViewElement() {
    return this.viewElement;
  }
}
