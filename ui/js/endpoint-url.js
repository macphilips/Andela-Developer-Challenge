var baseUrl = 'https://murmuring-citadel-13117.herokuapp.com';
var apiVersion = '/api/v1';
var apiUrl = baseUrl + apiVersion;
var registrationEndpoint = apiUrl + '/account/register';
var authenticationEndpoint = apiUrl + '/authenticate';
var entriesEndpoint = apiUrl + '/entries';

function getEntryUrlByID(id) {
  return entriesEndpoint + '/' + id;
}
