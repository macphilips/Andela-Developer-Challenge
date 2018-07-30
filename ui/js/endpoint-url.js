const baseUrl = 'https://murmuring-citadel-13117.herokuapp.com';
const apiVersion = '/api/v1';
const apiUrl = baseUrl + apiVersion;
const registrationEndpoint = `${apiUrl}/account/register`;
const authenticationEndpoint = `${apiUrl}/authenticate`;
const entriesEndpoint = `${apiUrl}/entries`;

function getEntryUrlByID(id) {
  return `${entriesEndpoint}/${id}`;
}
