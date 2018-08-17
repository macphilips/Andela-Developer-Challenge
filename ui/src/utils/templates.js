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

export const entryListPageTemplate = `
  <div class="main">   
    <div id="navbar"></div>
    <div id="entries" class="entries-container">
      <div>
        <div class="header">
            <span class="title">Your Diary Entries</span>
            <div class="add-entry">
                <a id="addEntry" title="Add Entry" class="btn create add-btn-js" role="button">Add Diary Entry</a>
            </div>
        </div>
        <div id="paginationTop"></div>
      </div>
      <div class="entry-list"></div>   
        <div id="paginationBottom"></div>   
      <a id="floatBtn" class=" add-btn-js" title="Add Entry" role="button">
        <div class="floating-button show-on-mobile">
            <span title="Add Entry" role="button" class="plus">&plus;</span>
        </div>
      </a>
    </div>
    <div id="footer"></div> 
  </div>
`;

export const entryListHeader = `
        <div>
          <div class="header">
              <span class="title">Your Diary Entries</span>
              <div class="add-entry">
                  <a id="addEntry" title="Add Entry" class="btn create" role="button">Add Diary Entry</a>
              </div>
          </div>
          <div id="pagination"></div>
        </div>`;

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
    <div id="loader" class="center-in-page loading-bg">
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
          <a href="#/" class="header-logo">
              <span class="logo-img"></span>            
          </a>
          <div class="nav">
              <ul class="logged-in">
                  <li>
                      <a href="#/dashboard">Dashboard</a>
                  </li>
                  <li>
                      <a href="#/profile">Profile</a>
                  </li>
                  <li>
                      <a class="logout-js">Logout</a>
                  </li>
              </ul>
              <ul class="logged-out">
                  <li>
                      <a href="#/signin">Sign In</a>
                  </li>
                  <li>
                      <a class="btn signup" href="#/signup">Sign Up</a>
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
                    <a href="#/dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="#/profile">Profile</a>
                </li>
                <li>
                    <a class="logout-js">Logout</a>
                </li>
            </ul>
            <ul class="logged-out" style="display: none;">
                <li>
                    <a href="#/signin">Sign In</a>
                </li>
                <li>
                    <a href="#/signup">Sign Up</a>
                </li>
            </ul>
        </div>
    </div>
    </div>
`;
export const floatingButton = `
    <a id="floatBtn" title="Add Entry" role="button">
      <div class="floating-button show-on-mobile">
          <span title="Add Entry" role="button" class="plus">&plus;</span>
      </div>
    </a>`;

export const loadingButtonTemplate = `
    <div id="loading" class="loading-ball-container">     
        <span class="loading-ball">
       <span></span>
       <span></span>
       <span></span>
     </span>
    </div>
`;

export const signInPageTemplate = `
    <div class="bg bgimg-1">
          <div class="overlay">
              <div class="container signin-top">
                  <div class="card form-container signin">
                      <div class="form-login-header">
                          <a href="#/"><img class="logo" src="images/logo-preview.gif"></a>
                      </div>
                      <form method="post" id="signinForm" name="signinForm">
                          <div class="form-title">
                              <span>Welcome, please sign in</span>
                          </div>
                          <hr>
                          <div>
                              <div id="alert" class="alert error">
                                  <p class="alert-msg"></p>
                                  <a href="javascript:void(0);" class="close-btn">&times;</a>
                              </div>
                              <label for="email"><b>Username</b></label>
                              <input class="form-input" id="email" type="email" placeholder="Enter Email" name="email"
                                     required>
  
                              <label for="password"><b>Password</b></label>
                              <input class="form-input" id="password" type="password" placeholder="Enter Password"
                                     name="password"
                                     required>
                              <button class="btn fit" type="button">                          
                                  <span>Login</span>
                              </button>
                          </div>
                          <div class="form-footer">
                              <p>Don't have an account? <a href="#/signup">Sign up</a>.</p>
                          </div>
                      </form>
                  </div>
              </div>
              <div id="footer" class="fixed-bottom white"></div> 
          </div>
      </div>
`;

export const signUpPageTemplate = `
    <div class="bg bgimg-1">
          <div class="overlay">
            <div class="container signin-top">
                <div class="form-container card">
                    <form method="post" id="signupForm" name="signupForm">
                        <div class="form-title">
                            <span>Create Account</span>
                        </div>
                        <hr>
                        <div>
                            <div id="alert" class="alert error">
                                <p class="alert-msg">Alert Message</p>
                                <a href="javascript:void(0);" class="close-btn">&times;</a>
                            </div>
                            <div class="row-col-2">
                                <div>
                                    <label for="first_name"><b>First name</b></label>
                                    <input class="form-input" id="first_name" type="text" placeholder="First name"
                                           name="firstName"
                                           required>
                                </div>
                                <div>
                                    <label for="last_name"><b>Last name</b></label>
                                    <input class="form-input" id="last_name" type="text" placeholder="Last name"
                                           name="lastName"
                                           required>
                                </div>
                            </div>
                            <label for="email"><b>Email</b></label>
                            <input class="form-input" id="email" type="email" placeholder="Enter Email" name="email"
                                   required>
                            <label for="password"><b>Password</b></label>
                            <input class="form-input" id="password" type="password" placeholder="Enter Password"
                                   name="password"
                                   required>
                            <label for="match-password"><b>Confirm Password</b></label>
                            <input class="form-input" id="match-password" type="password" placeholder="Confirm Password"
                                   name="match-password" required>
                            <hr>
                            <button type="button" class="btn fit"><span>Register</span></button>
                        </div>
                        <div class="form-footer">
                            <p>Already have an account? <a href="#/signin">Sign in</a>.</p>
                        </div>
                    </form>
                </div>
            </div>
            <div id="footer" class="fixed-bottom white"></div>
          </div> 
      </div>
`;
export const homeTemplate = ` 
 <div>    
    <div id="navbar"></div>
    <div class="bg bgimg navbar-top-padding fade-in">
        <div class="overlay">
        <div class="about left">
            <h1>MyDiary</h1>
            <p>MyDiary is an online personal journal where users can pen down their thoughts and feelings, it's simple and convenient in use.</p>
            <div>
                <a class="btn get-started" href="#/signup">
                    Get Started
                </a>
            </div>
            <div class="show-on-mobile">
                <a class="btn signin " href="#/signin">Sign In</a>
            </div>
        </div>
    </div>
    </div>
    <div id="footer" class="fixed-bottom white"></div> 
 </div>
`;
export const profilePageTemplate = ` 
    <div>     
        <div id="navbar"></div>
        <div class="main">        
            <div class="container">
          <div id="entrySummary" class="entry-summary">
              <ul>
                  <li>Total Entries: <span tc-data-model="count"></span></li>
                  <li>Last Update: <span tc-data-model="lastModified"></span></li>
              </ul>
          </div>
          <div class="section">
              <section id="reminder">
                  <div class="section-title">
                      <span>Reminder Settings</span>
                  </div>
                  <hr>
                  <div class="section-content">
                      <form id="reminderForm" name="reminderForm">
                          <div>
                              <div class="sub-title">
                                  <span>Set daily reminder</span>
                              </div>
                              <div class="row-col-2">
                                  <div>
                                      <label>
                                          FROM
                                          <select tc-data-model="from" class="form-input" id="from"
                                                  name="from" required>
                                              <option disabled selected>From</option>
                                              <option value="MONDAY">Monday</option>
                                              <option value="TUESDAY">Tuesday</option>
                                              <option value="WEDNESDAY">Wednesday</option>
                                              <option value="THURSDAY">Thursday</option>
                                              <option value="FRIDAY">Friday</option>
                                              <option value="SATURDAY">Saturday</option>
                                              <option value="SUNDAY">Sunday</option>
                                          </select>
                                      </label>
                                  </div>
                                  <div>
                                      <label>
                                          TO
                                          <select tc-data-model="to" class="form-input" id="to"
                                                  name="to" required>
                                              <option disabled selected>To</option>
                                              <option value="MONDAY">Monday</option>
                                              <option value="TUESDAY">Tuesday</option>
                                              <option value="WEDNESDAY">Wednesday</option>
                                              <option value="THURSDAY">Thursday</option>
                                              <option value="FRIDAY">Friday</option>
                                              <option value="SATURDAY">Saturday</option>
                                              <option value="SUNDAY">Sunday</option>
                                          </select>
                                      </label>
                                  </div>
                              </div>
                              <div>
                                  <label class="show-on-mobile">TIME</label>
                                  <div class="time-spinner">
                                      <input name="hours" tc-data-model="hours" id="hours" type="number"
                                             class="time-input hours"
                                             data-unit="hours"
                                             placeholder="HH" autocomplete="off">
                                      <span class="time-delimiter">&colon;</span>
                                      <input name="minutes" tc-data-model="minutes" id="minutes" type="number"
                                             class="time-input minutes"
                                             placeholder="MM" data-unit="minutes" autocomplete="off">
                                      <div class="time-controller">
                                              <span class="time-controller-btn up" data-direction="up">
                                              </span>
                                          <span class="time-controller-btn down" data-direction="down">
                                              </span>
                                      </div>
                                  </div>
                              </div>
                              <div class="btn-container">
                                  <button tc-data-action="reminder" type="button" class="btn right">Set Reminder</button>
                              </div>
                          </div>
                      </form>
                  </div>
              </section>
              <section id="profile">
                  <div class="section-title">
                      <span>Manage Profile</span>
                  </div>
                  <hr>
                  <div class="section-content">
                      <form id="signupForm" name="signupForm">
                          <div>
                              <div class="row-col-2">
                                  <div>
                                      <label for="first_name"><b>First name</b></label>
                                      <input tc-data-model="firstName" class="form-input" id="first_name" type="text"
                                             placeholder="First name"
                                             name="firstName"
                                             required>
                                  </div>
                                  <div>
                                      <label for="last_name"><b>Last name</b></label>
                                      <input tc-data-model="lastName" class="form-input" id="last_name" type="text"
                                             placeholder="Last name"
                                             name="lastName"
                                             required>
                                  </div>
                              </div>
                              <label for="email"><b>Email</b></label>
                              <input tc-data-model="email" class="form-input" id="email" type="email"
                                     placeholder="Enter Email" name="email"
                                     required>
                              <div class="btn-container">
                                  <button type="submit" class="btn right">Update Profile</button>
                              </div>
                          </div>
                      </form>
                  </div>
              </section>
  
              <section id="changePassword">
                  <div class="section-title">
                      <span>Change Password</span>
                  </div>
                  <hr>
                  <div class="section-content">
                      <form id="changePasswordForm">
                          <label for="password"><b>Old Password</b></label>
                          <input class="form-input" id="prev-password" type="password" placeholder="Old Password"
                                 name="oldPassword"
                                 required>
                          <label for="password"><b>New Password</b></label>
                          <input class="form-input" id="password" type="password" placeholder="New Password"
                                 name="newPassword"
                                 required>
                          <label for="match-password"><b>Confirm Password</b></label>
                          <input class="form-input" id="match-password" type="password" placeholder="Confirm Password"
                                 name="matchPassword" required>
                          <div class="btn-container">
                              <button tc-data-action="change-password" type="submit" class="btn right">Change Password
                              </button>
                          </div>
                      </form>
                  </div>
              </section>
          </div>
        </div>
        </div>
        <div id="footer"></div> 
    </div>
`;

export const notFoundTemplate = `
  <div>
    <div id="navbar"></div>    
    <div class="center-in-page">
        <div class="page-404">
            <div>Page Not Found</div>
        </div>
    </div>
    <div id="footer" class="fixed-bottom"></div> 
  </div>
`;

export const footerTemplate = `
    <div class="page-footer">
        <div>&copy; 2018 MyDiary </div>
    </div>`;

export const paginationTopTemplate = `
<div class="pagination-container">
  <div tc-data-page-index="page">
    <span tc-data-model="visibleEntries"></span>
    &nbsp;<span>of</span> &nbsp;
    <span tc-data-model="totalEntries"></span>
  </div>
  <div class="pagination">
    <a data-direction="prev">❮</a>
    <a data-direction="next">❯</a>
  </div>
</div>`;
export const paginationBottomTemplate = ` 
 
<div class="center">
    <div class="pagination">
        <a data-direction="prev">❮</a>
        <a tc-data-model="page" class="disable">0</a>
        <a data-direction="next">❯</a>
    </div>
</div>
`;
