import { bindPropertiesToElement, htmlToElement } from '../utils';
import { paginationBottomTemplate, paginationTopTemplate } from '../utils/templates';
import Event from '../utils/event';

export default class PaginationView {
  constructor() {
    this.data = null;
    this.viewElementTop = htmlToElement(paginationTopTemplate);
    this.viewElementBottom = htmlToElement(paginationBottomTemplate);
    this.onChangePage = new Event(this);
    this.registerPageChangeEvent(this.viewElementTop);
    this.registerPageChangeEvent(this.viewElementBottom);
  }

  registerPageChangeEvent(element) {
    this.nextButton = element.querySelector('[data-direction="next"]');
    this.prevButton = element.querySelector('[data-direction="prev"]');
    this.nextButton.onclick = this.handlePageChange();
    this.prevButton.onclick = this.handlePageChange();
  }

  render(element, data) {
    const paginationTop = element.querySelector('#paginationTop');
    const paginationBottom = element.querySelector('#paginationBottom');
    if (!data || !element
      || (!paginationTop && !paginationBottom)) return;
    this.data = data;
    this.renderTop(data, element);
    this.renderBottom(data, element);
  }

  renderBottom(data, element) {
    const { page, size, totalEntries } = data;
    const totalPages = Math.max(Math.ceil(totalEntries / size), 1);
    const paginationBottom = element.querySelector('#paginationBottom');
    if (paginationBottom) {
      paginationBottom.innerHTML = '';
      paginationBottom.appendChild(this.viewElementBottom);
      bindPropertiesToElement(this.viewElementBottom.querySelectorAll('[tc-data-model]'),
        { page: `Page ${page} of ${totalPages}` });
    }
  }

  renderTop(data, element) {
    const paginationTop = element.querySelector('#paginationTop');
    const { totalEntries, page, size } = data;
    const start = ((page - 1) * size) + 1;
    let end = page * size;
    end = (end > totalEntries) ? totalEntries : end;
    const visibleEntries = `${start} - ${end}`;
    const pageIndexElement = this.viewElementTop.querySelector('[tc-data-page-index]');
    pageIndexElement.setAttribute('tc-data-page-index', page);
    bindPropertiesToElement(this.viewElementTop.querySelectorAll('[tc-data-model]'),
      { totalEntries, visibleEntries, page });
    if (paginationTop) {
      paginationTop.innerHTML = '';
      if (totalEntries > 0) paginationTop.appendChild(this.viewElementTop);
    }
  }

  handlePageChange() {
    return (e) => {
      const { target } = e;
      const direction = target.getAttribute('data-direction');
      let page = parseInt(this.viewElementTop.querySelector('[tc-data-page-index]').getAttribute('tc-data-page-index'), 10);
      if (direction === 'next') {
        page += 1;
      } else {
        page -= 1;
      }
      this.onChangePage.notify({ page });
    };
  }

  getViewElement() {
    return this.viewElementTop;
  }
}
