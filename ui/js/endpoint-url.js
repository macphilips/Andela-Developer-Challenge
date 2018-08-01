const baseUrl = 'http://localhost:3030';
const apiVersion = '/api/v1';
const apiUrl = baseUrl + apiVersion;
const registrationEndpoint = `${apiUrl}/auth/signup`;
const authenticationEndpoint = `${apiUrl}/auth/login`;
const entriesEndpoint = `${apiUrl}/entries`;

function getEntryUrlByID(id) {
  return `${entriesEndpoint}/${id}`;
}
