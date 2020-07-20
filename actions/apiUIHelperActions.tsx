// import Raven from 'raven-js';

export const CLEAR_API_ERROR_MESSAGE = 'CLEAR_API_ERROR_MESSAGE';

const errorMessageClearer = () => {
    return {
        type: CLEAR_API_ERROR_MESSAGE
    };
};

export const clearErrorMessage = () => (dispatch, getState) => {
    return dispatch(errorMessageClearer());
};

export const logException = (ex, context) => {
    if ((context.action === "GET_USER_ID_DOCUMENT" || context.action === "GET_USER_MEDICAL_RECOMMENDATION") && ex.includes("has no current")) {
        Raven.captureException(ex, {
            extra: context
        });
    }
};