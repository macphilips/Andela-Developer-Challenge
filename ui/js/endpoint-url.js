const baseUrl = 'http://localhost:3030';
const apiVersion = '/api/v1';
const apiUrl = baseUrl + apiVersion;
const userProfile = `${apiUrl}/account/me`;
const changePassword = `${apiUrl}/account/change-password`;
const reminder = `${apiUrl}/account/user/reminder/settings`;
const registrationEndpoint = `${apiUrl}/auth/signup`;
const authenticationEndpoint = `${apiUrl}/auth/login`;
const entriesEndpoint = `${apiUrl}/entries`;

function getEntryUrlByID(id) {
  return `${entriesEndpoint}/${id}`;
}
