export const modalBoxTemplate = `
<div id="modal-box" class="modal">
    <div class="modal-content"></div>
</div>`;

export const deleteDialogTemple = `
        <div class="modal-header">
            <span class="modal-header-title" role="heading">
                Confirm Delete
            </span>
            <span tc-data-dismiss="modal"  class="action-btn close" role="button" tabindex="0" aria-label="Close"></span>
        </div>
        <div tc-data-model="message" class="modal-body">This action delete entry from database. Are you sure you want to continue?
        </div>
        <div class="modal-footer">
            <button tc-data-action="ok" name="ok" class="btn-ok">OK</button>
            <button tc-data-dismiss="cancel"  name="cancel">Cancel</button>
        </div>`;

// export const entryTableHeadTemplate = `
//             <tr class="header-filter">
//                 <td colspan="3">
//                     <span class="title">Diary Entries</span>
//                 </td>
//                 <td></td>
//                 <td>
//                     <div class="action-btn-container">
//                         <a id="deleteEntry" title="Delete Entries" class="action-btn delete m-0 hide" role="button"
//                           aria-label="Add"></a>
//                         <a id="addEntry" title="Add Entry" class="action-btn add m-0" role="button"
//                           aria-label="Add"></a>
//                     </div>
//                 </td>
//
//             </tr>
//             <tr>
//                 <td>
//                     <label class="custom-checkbox">
//                         <input tc-data-action="check" type="checkbox">
//                         <span class="check-mark"></span>
//                     </label>
//                 </td>
//                 <td class="content-width">Content</td>
//                 <td>Date</td>
//                 <td>Last Modified</td>
//                 <td></td>
//             </tr>`;

export const entryListHeader = `
        <div class="header">
            <span class="title">Your Diary Entries</span>
            <div class="add-entry">
                <a id="addEntry" title="Add Entry" class="btn create" role="button">Add Diary Entry</a>
            </div>
        </div>`;

// export const entryTableBodyRowTemplate = `
//             <tr>
//                 <td class=""><label class="custom-checkbox">
//                         <input class="check-box" data-index="" tc-data-id="{{id}}" tc-data-action="check" type="checkbox">
//                         <span class="check-mark"></span>
//                     </label></td>
//                 <td>
//                     <p class="title" tc-data-model="title">Sample</p>
//                     <p class="content" tc-data-model="content">This is a sample content</p>
//                 </td>
//                 <td class="" tc-data-model="createdDate">date created sample</td>
//                 <td class=""  tc-data-model="lastModified">last modified</td>
//                 <td>
//                     <div>
//                         <div class="dropdown">
//                             <a data-index=""  tc-data-action="dropdown-toggle" class="dropdown-toggle"></a>
//                             <ul class="dropdown-menu">
//                                 <li><a tc-data-action="view" href="javascript:void(0);">View</a></li>
//                                 <li><a tc-data-action="edit" href="javascript:void(0);">Edit</a></li>
//                                 <li><a tc-data-action="delete" href="javascript:void(0);">Delete</a></li>
//                             </ul>
//                         </div>
//                     </div>
//                 </td>
//             </tr>`;

export const entryListItemTemplate = `
            <div class="entry">
                <p class="title" tc-data-model="title"></p>
                <div class="content line-clamp">
                    <p class="block-with-text" tc-data-model="content"></p>
                </div>
                <div class="footer">
                    <div>
                        <span>Last Modified:</span>&nbsp;
                        <span tc-data-model="lastModified"></span>
                    </div>
                    <div class="dropdown">
                        <a data-index="" tc-data-action="dropdown-toggle"
                           class="dropdown-toggle-icon"></a>
                        <ul class="dropdown-menu">
                            <li><a tc-data-action="view">View</a></li>
                            <li><a tc-data-action="edit">Edit</a></li>
                            <li><a tc-data-action="delete">Delete</a></li>
                        </ul>
                    </div>
                </div>
            </div>`;

export const createEntryTemplate = `       
    <div class="flexbox-parent scrollable">
      <div id="alert" class="alert error">
          <p class="alert-msg"></p>
          <a href="javascript:void(0);" class="close-btn">&times;</a>
      </div>
      <div class="modal-header">
          <div id="modal-header-title">
              <p tc-data-model="lastModified"></p>
              <input tc-data-model="title" placeholder="Title" class="form-input modal-header-input">
              <!--<span tc-data-model="title" class="modal-header-title"></span>-->
          </div>
          <span tc-data-dismiss="modal" class="action-btn close" role="button" tabindex="0" aria-label="Close"></span>
      </div>
      <div class="grow-body modal-body">
          <div class="create-entry">
              <textarea placeholder="Dear Diary, " id="entry" autofocus></textarea>
          </div>
      </div>
      <div class="modal-footer">
        <button tc-data-action="save" type="button" class="btn-save">Save</button>
        <button tc-data-dismiss="cancel" type="button" class="btn-cancel">Cancel</button>
    </div>
    </div>
`;
export const viewEntryTemplate = `
     <div  class="scrollable">                
        <div class="modal-header">
            <div id="modal-header-title">
                <p tc-data-model="lastModified"></p>
                <span tc-data-model="title" class="modal-header-title"></span>
            </div>
            <span tc-data-dismiss="modal"  class="action-btn close" role="button" tabindex="0" aria-label="Close"></span>
        </div>               
        <div class="grow-body modal-body"> 
            <div class="content-container"></div>                
        </div>  
     </div>
`;
export const loadingTemplate = `
    <div class="loading-container loading-bg">
        <div class="loading-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>`;

export const emptyListTemple = '<div class="empty-list"><span>No Entry</span></div>';

export const navbarHeaderTemplate = ` 
    <div>
      <div class="nav-container">
          <header class="nav-header">
          <a class="navicon">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="19" viewBox="0 0 23 19">
                      <g fill="none">
                          <g fill="#555">
                              <rect y="16" width="23" height="3" rx="1.5"></rect>
                              <rect width="23" height="3" rx="1.5"></rect>
                              <rect y="8" width="23" height="3" rx="1.5"></rect>
                          </g>
                      </g>
                  </svg>
          </a>
          <a href="index.html" class="header-logo">
              <span class="logo-img"></span>            
          </a>
          <div class="nav">
              <ul class="logged-in">
                  <li>
                      <a href="dashboard.html">Dashboard</a>
                  </li>
                  <li>
                      <a href="profile.html">Profile</a>
                  </li>
                  <li>
                      <a class="logout-js">Logout</a>
                  </li>
              </ul>
              <ul class="logged-out">
                  <li>
                      <a href="signin.html">Sign In</a>
                  </li>
                  <li>
                      <a class="btn signup" href="signup.html">Sign Up</a>
                  </li>
              </ul>            
          </div>
      </header>     
      </div>
      <div class="side-nav">
        <div class="nav">
            <span tc-data-dismiss="side-nav"  class="action-btn close" role="button" tabindex="0" aria-label="Close"></span>
            <ul class="logged-in">
                <li>
                    <a href="dashboard.html">Dashboard</a>
                </li>
                <li>
                    <a href="profile.html">Profile</a>
                </li>
                <li>
                    <a class="logout-js">Logout</a>
                </li>
            </ul>
            <ul class="logged-out" style="display: none;">
                <li>
                    <a href="signin.html">Sign In</a>
                </li>
                <li>
                    <a href="signup.html">Sign Up</a>
                </li>
            </ul>
        </div>
    </div>
    </div>
`;
export const floatingButton = `
    <a title="Add Entry" role="button">
      <div class="floating-button show-on-mobile">
          <span title="Add Entry" role="button" class="plus">&plus;</span>
      </div>
    </a>`;
