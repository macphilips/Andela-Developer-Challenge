import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { entryPropType } from '../propsValidator';

export default class EntryListItem extends Component {
  showDropDownMenu = (e) => {
    const { nextElementSibling } = e.target;
    if (nextElementSibling.classList.contains('open')) {
      nextElementSibling.classList.remove('open');
    } else {
      this.dismissDropDownMenu();
      nextElementSibling.classList.add('open');
    }
    window.addEventListener('click', this.handlerWindowClicked);
  };

  handlerWindowClicked = (event) => {
    if (!event.target.matches('.dropdown-toggle-icon')) {
      this.dismissDropDownMenu();
      window.removeEventListener('click', this.handlerWindowClicked);
    }
  };

  /**
   * @static
   * @private
   */
  dismissDropDownMenu = () => {
    const dropdownMenus = document.getElementsByClassName('dropdown-menu');
    for (let i = 0; i < dropdownMenus.length; i += 1) {
      const openDropdown = dropdownMenus[i];
      if (openDropdown.classList.contains('open')) {
        openDropdown.classList.remove('open');
      }
    }
  };

  handleViewClick = (e) => {
    const targetElement = e.target;
    if (targetElement.classList.contains('dropdown-toggle')) {
      return null;
    }
    const attrData = targetElement.getAttribute('data-action');
    if (attrData) {
      return null;
    }
    this.props.onDropdownItemClicked('view');
  };

  onDropdownItemClicked = (e) => {
    const action = e.target.getAttribute('data-action');
    this.props.onDropdownItemClicked(action);
    this.dismissDropDownMenu();
  };

  render() {
    return (
      <div
        onClick={this.handleViewClick}
        id={`entryListItem${this.props.entry.id}`}
        className="entry">
        <p className="title" data-model="title">
          {this.props.entry.title}
        </p>
        <div className="content line-clamp">
          <p className="block-with-text" data-model="content">
            {this.props.entry.content}
          </p>
        </div>
        <div className="footer">
          <div>
            <span>Last Modified:</span>
            &nbsp;
            <span data-model="lastModified">
              {this.props.entry.lastModified}
            </span>
          </div>
          <div className="dropdown">
            <span onClick={this.showDropDownMenu}
                  data-index=""
                  data-action="dropdown-toggle"
                  className="dropdown-toggle-icon"
            />
            <ul className="dropdown-menu">
              {
                ['View', 'Edit', 'Delete'].map(item => (
                  <li key={item}>
                    <a onClick={this.onDropdownItemClicked} data-action={item}>{item}</a>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

EntryListItem.propTypes = {
  entry: entryPropType.isRequired,
  onDropdownItemClicked: PropTypes.func.isRequired,
};
