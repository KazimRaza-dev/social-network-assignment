import auth from "./auth.middleware";
import registerRequest from "./registerUser.middleware";
import loginRequest from "./loginUser.middleware";
import handleError from "./handleErrors.middleware"
import connectUser from "./connectUser.middleware";
import validateNewPost from "./validatePost.middleware";
import validateEditPost from "./validateEditPost.middleware"

export { auth, registerRequest, loginRequest, handleError, connectUser, validateNewPost, validateEditPost }