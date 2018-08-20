export const baseUrl = process.env.SERVER_API_URL;
export const apiVersion = '/api/v1';
export const apiUrl = baseUrl + apiVersion;
export const userProfile = `${apiUrl}/account`;
export const userProfileDetails = `${userProfile}/me/detailed`;
export const updateToken = `${userProfile}/register-token`;
export const changePassword = `${userProfile}/change-password`;
export const reminderUrl = `${userProfile}/user/reminder/settings`;
export const registrationEndpoint = `${apiUrl}/auth/signup`;
export const authenticationEndpoint = `${apiUrl}/auth/login`;
export const entriesEndpoint = `${apiUrl}/entries`;

export function getEntryUrlByID(id) {
  return `${entriesEndpoint}/${id}`;
}
