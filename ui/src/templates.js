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
export const entryTableHeadTemplate = `
            <tr class="header-filter">
                <td colspan="3">
                    <span class="title">Diary Entries</span>
                </td>
                <td></td>
                <td>
                    <div class="action-btn-container">                
                        <a id="deleteEntry" title="Delete Entries" class="action-btn delete m-0 hide" role="button"
                          aria-label="Add"></a>
                        <a id="addEntry" title="Add Entry" class="action-btn add m-0" role="button"
                          aria-label="Add"></a>
                    </div>
                </td>

            </tr>
            <tr>
                <td>
                    <label class="custom-checkbox">
                        <input tc-data-action="check" type="checkbox">
                        <span class="check-mark"></span>
                    </label>
                </td>
                <td class="content-width">Content</td>
                <td>Date</td>
                <td>Last Modified</td>
                <td></td>
            </tr>`;

export const entryTableBodyRowTemplate = `
            <tr>
                <td><label class="custom-checkbox">
                        <input data-index="" tc-data-id="{{id}}" tc-data-action="check" type="checkbox">
                        <span class="check-mark"></span>
                    </label></td>
                <td><p class="content" tc-data-model="content">This is a sample content</p></td>
                <td tc-data-model="createdDate">date created sample</td>
                <td tc-data-model="lastModified">last modified</td>
                <td>
                    <div>
                        <div class="dropdown">
                            <a data-index=""  tc-data-action="dropdown-toggle" class="dropdown-toggle"></a>
                            <ul class="dropdown-menu">
                                <li><a tc-data-action="view" href="javascript:void(0);">View</a></li>
                                <li><a tc-data-action="edit" href="javascript:void(0);">Edit</a></li>
                                <li><a tc-data-action="delete" href="javascript:void(0);">Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>`;

export const createEntryTemplate = `
    <form>    
        <div class="modal-header">
            <div id="modal-header-title">
                <input tc-data-model="title" placeholder="Title" class="form-input modal-header-input">
                <span tc-data-model="title" class="modal-header-title">
                        Create New Diary Entry
                </span>
                <p tc-data-model="lastModified"></p>
            </div>
            <span tc-data-dismiss="modal"  class="action-btn close" role="button" tabindex="0" aria-label="Close"></span>
        </div> 
        <div id="alert" class="alert error">
            <p class="alert-msg"></p>
            <a href="javascript:void(0);" class="close-btn">&times;</a>
        </div>        
                
        <div class="modal-body"> 
        <div class="create-entry"><textarea placeholder="Dear Diary, " id="entry" rows="17" autofocus></textarea></div>                
        </div> 
        <div class="modal-footer">
            <button tc-data-action="save" type="button" class="btn-save">Save</button>
            <button tc-data-dismiss="cancel" type="button" class="btn-cancel">Cancel</button>
        </div>
    </form>
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

export const emptyListTemple = '<tr><td  colspan="5"><div class="empty-list"><span>No Entry</span></div></td></tr>';

export const navbarHeaderTemplate = `    
    <header class="nav-header">
        <a href="/" class="header-logo">
            <span class="logo-img"></span>            
        </a>
        <div class="nav">
            <ul class="logged-in">
                <li>
                    <a href="profile.html">Profile</a>
                </li>
                <li>
                    <a id="logout">Logout</a>
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
    </header>`;
