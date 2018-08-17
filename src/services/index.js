import FetchWrapper from './fetchWrapper';
import ApiRequestService from './apiRequestService';
import LoginService from './loginService';
import UserAccount from './userAccount';
import ModalService from './modalViewService';

export const http = new FetchWrapper();
export const apiRequest = new ApiRequestService(http);
export const account = new UserAccount(apiRequest);
export const loginService = new LoginService(account, http, apiRequest);
export const modalService = new ModalService();
