import { iResponse } from "../interfaces/index.interface";

const responseWrapper = (statusCode: number, msg: string) => {
    const response: iResponse = {
        statusCode: statusCode,
        message: msg
    }
    return response;
}

export default responseWrapper;