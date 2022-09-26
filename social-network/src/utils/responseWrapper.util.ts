import { iResponse } from "../interfaces/index.interface";

/**
 * Generic wrapper function for both success and failure of request, Create an object containing 
 * status code and message that will send in reponse to the user request
 *
 * @param statusCode Status code to be send
 * @param msg Message to send 
 * @returns Object with status code and message
 */
const responseWrapper = (statusCode: number, msg: string) => {
    const response: iResponse = {
        statusCode: statusCode,
        message: msg
    }
    return response;
}

export default responseWrapper;