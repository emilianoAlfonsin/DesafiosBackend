import logger from "./logger.js";

export function handleSuccess(res, status, message, payload) {
    res.status(status).json({
        status: "success",
        message: message,
        payload: payload
    });
}

export function handleError(res, status, errorCode, description, error) {
    logger.error(`${description}: ${error.message}`);
    res.status(status).json({
        status: "failure",
        errorCode: errorCode,
        description: description,
        message: error.message
    });
}