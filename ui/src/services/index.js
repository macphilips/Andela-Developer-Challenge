import FetchWrapper from './fetchWrapper';
import ApiRequestService from './apiRequestService';
import LoginService from './loginService';
import UserAccount from './userAccount';
import ModalService from './modalViewService';
import FooterViewService from './footerViewService';
import NavBarViewService from './navBarViewService';

export const http = new FetchWrapper();
export const apiRequest = new ApiRequestService(http);
export const account = new UserAccount(apiRequest);
export const loginService = new LoginService(account, http, apiRequest);
export const modalService = new ModalService();
export const footerViewService = new FooterViewService();
export const navBarViewService = new NavBarViewService(account, loginService);
navBarViewService.init();
