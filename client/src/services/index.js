import FetchWrapper from './fetchWrapper';
import ApiRequestService from './apiRequestService';
import UserAccount from './userAccount';
import NotificationSettings from './notificationSettings';
import LoginService from './loginService';

export const http = new FetchWrapper();
export const apiRequest = new ApiRequestService(http);
export const account = new UserAccount(apiRequest);
export const notificationService = new NotificationSettings(apiRequest);
export const loginService = new LoginService(account, http, apiRequest, notificationService);
