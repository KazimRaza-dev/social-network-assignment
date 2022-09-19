import iUser from "./user.interface";
import iPost from "./post.interface";
import iResponse from "./response.interface";
import { iRegisterBody, iLoginBody } from "./requestBody/auth.interfaces";
import { iPostBody, iEditPostBody } from "./requestBody/post.interfaces";
import { iConnectUserBody } from "./requestBody/user.interface";
import userAuthRequest from "./userRequest.interface";

export { iUser, iPost, userAuthRequest, iResponse, iRegisterBody, iLoginBody, iPostBody, iEditPostBody, iConnectUserBody };