export const baseUrl = 'https://shielded-waters-94006.herokuapp.com';
export const apiVersion = '/api/v1';
export const apiUrl = baseUrl + apiVersion;
export const userProfile = `${apiUrl}/account/me`;
export const changePassword = `${apiUrl}/account/change-password`;
export const reminder = `${apiUrl}/account/user/reminder/settings`;
export const registrationEndpoint = `${apiUrl}/auth/signup`;
export const authenticationEndpoint = `${apiUrl}/auth/login`;
export const entriesEndpoint = `${apiUrl}/entries`;

export function getEntryUrlByID(id) {
  return `${entriesEndpoint}/${id}`;
}
