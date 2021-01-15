import { CALL_API, Schemas } from '../middleware/api';

export const GET_SPECIFIC_USER = 'GET_SPECIFIC_USER';
export const GET_SPECIFIC_USER_SUCCESS = 'GET_SPECIFIC_USER_SUCCESS';
export const GET_SPECIFIC_USER_FAILURE = 'GET_SPECIFIC_USER_FAILURE';

const specificUser = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [GET_SPECIFIC_USER, GET_SPECIFIC_USER_SUCCESS, GET_SPECIFIC_USER_FAILURE],
    endPoint: `user/${userId}`,
    schema: Schemas.USER,
  },
});

export const getSpecificUser = (userId) => (dispatch) => {
  return dispatch(specificUser(userId));
};

export const USER_ID_DOCUMENT = 'identification_document';
export const USER_MEDICAL_RECOMMENDATION = 'medical_recommendation';

export const GET_USER_ID_DOCUMENT = 'GET_USER_ID_DOCUMENT';
export const GET_USER_ID_DOCUMENT_SUCCESS = 'GET_USER_ID_DOCUMENT_SUCCESS';
export const GET_USER_ID_DOCUMENT_FAILURE = 'GET_USER_ID_DOCUMENT_FAILURE';

const userIdDocument = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [GET_USER_ID_DOCUMENT, GET_USER_ID_DOCUMENT_SUCCESS, GET_USER_ID_DOCUMENT_FAILURE],
    endPoint: `user/${USER_ID_DOCUMENT}/${userId}`,
    schema: Schemas.USER_ID_DOCUMENT,
  },
});

export const getUserIdDocument = (userId) => (dispatch) => {
  return dispatch(userIdDocument(userId));
};

export const GET_USER_MEDICAL_RECOMMENDATION = 'GET_USER_MEDICAL_RECOMMENDATION';
export const GET_USER_MEDICAL_RECOMMENDATION_SUCCESS = 'GET_USER_MEDICAL_RECOMMENDATION_SUCCES';
export const GET_USER_MEDICAL_RECOMMENDATION_FAILURE = 'GET_USER_MEDICAL_RECOMMENDATION_FAILURE';

const userMedicalRecommendation = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_USER_MEDICAL_RECOMMENDATION,
      GET_USER_MEDICAL_RECOMMENDATION_SUCCESS,
      GET_USER_MEDICAL_RECOMMENDATION_FAILURE,
    ],
    endPoint: `user/${USER_MEDICAL_RECOMMENDATION}/${userId}`,
    schema: Schemas.USER_MEDICAL_RECOMMENDATION,
  },
});

export const getUserMedicalRecommendation = (userId) => (dispatch) => {
  return dispatch(userMedicalRecommendation(userId));
};

export const HIDE_USER_DOCUMENT = 'HIDE_USER_DOCUMENT';
export const HIDE_USER_DOCUMENT_SUCCESS = 'HIDE_USER_DOCUMENT_SUCCESS';
export const HIDE_USER_DOCUMENT_FAILURE = 'HIDE_USER_DOCUMENT_FAILURE';

const userDocumentHider = (documentId, docType) => {
  const userDocument = {
    id: documentId,
  };

  switch (docType) {
    case USER_ID_DOCUMENT:
    case USER_MEDICAL_RECOMMENDATION:
      return {
        [CALL_API]: {
          httpAction: 'POST',
          types: [HIDE_USER_DOCUMENT, HIDE_USER_DOCUMENT_SUCCESS, HIDE_USER_DOCUMENT_FAILURE],
          endPoint: `user/${docType}/hide`,
          schema:
            docType === USER_ID_DOCUMENT
              ? Schemas.USER_ID_DOCUMENT
              : Schemas.USER_MEDICAL_RECOMMENDATION,
          body: userDocument,
        },
      };
    default:
      throw new Error('Invalid document type.');
  }
};

export const hideUserDocument = (documentId, docType) => (dispatch, getState) => {
  return dispatch(userDocumentHider(documentId, docType));
};

export const UNHIDE_USER_DOCUMENT = 'UNHIDE_USER_DOCUMENT';
export const UNHIDE_USER_DOCUMENT_SUCCESS = 'UNHIDE_USER_DOCUMENT_SUCCESS';
export const UNHIDE_USER_DOCUMENT_FAILURE = 'UNHIDE_USER_DOCUMENT_FAILURE';

const userDocumentUnhider = (documentId, docType) => {
  const userDocument = {
    id: documentId,
  };

  switch (docType) {
    case USER_ID_DOCUMENT:
    case USER_MEDICAL_RECOMMENDATION:
      return {
        [CALL_API]: {
          httpAction: 'POST',
          types: [UNHIDE_USER_DOCUMENT, UNHIDE_USER_DOCUMENT_SUCCESS, UNHIDE_USER_DOCUMENT_FAILURE],
          endPoint: `user/${docType}/unhide`,
          schema:
            docType === USER_ID_DOCUMENT
              ? Schemas.USER_ID_DOCUMENT
              : Schemas.USER_MEDICAL_RECOMMENDATION,
          body: userDocument,
        },
      };
    default:
      throw new Error('Invalid document type.');
  }
};

export const unhideUserDocument = (documentId, docType) => (dispatch, getState) => {
  return dispatch(userDocumentUnhider(documentId, docType));
};

export const CREATE_USER_NOTE = 'CREATE_USER_NOTE';
export const CREATE_USER_NOTE_SUCCESS = 'CREATE_USER_NOTE_SUCCESS';
export const CREATE_USER_NOTE_FAILURE = 'CREATE_USER_NOTE_FAILURE';

const userNoteCreator = (userId, note, dsprDriverId, dsprManagerId) => {
  const userNote = {
    user: { id: userId },
    note,
  };

  if (dsprDriverId) {
    if (dsprManagerId)
      throw new Error('Cannot have both dsprDriverId and dsprManagerId when creating a userNote');
    userNote['dsprDriver'] = { id: dsprDriverId };
  } else {
    if (dsprManagerId == null)
      throw new Error(
        'Must have one of dsprDriverId or dsprManagerId set when creating a userNote'
      );
    userNote['dsprManager'] = { id: dsprManagerId };
  }
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [CREATE_USER_NOTE, CREATE_USER_NOTE_SUCCESS, CREATE_USER_NOTE_FAILURE],
      endPoint: `user/note`,
      schema: Schemas.USER_NOTE,
      body: userNote,
    },
  };
};

export const createUserNote = (userId, note, dsprDriverId, dsprManagerId) => (
  dispatch,
  getState
) => {
  return dispatch(userNoteCreator(userId, note, dsprDriverId, dsprManagerId));
};

export const HIDE_USER_NOTE = 'HIDE_USER_NOTE';
export const HIDE_USER_NOTE_SUCCESS = 'HIDE_USER_NOTE_SUCCESS';
export const HIDE_USER_NOTE_FAILURE = 'HIDE_USER_NOTE_FAILURE';

const hideNote = (id: number) => {
  const userNote = { id };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [HIDE_USER_NOTE, HIDE_USER_NOTE_SUCCESS, HIDE_USER_NOTE_FAILURE],
      endPoint: `user/note/hide`,
      schema: Schemas.USER_NOTE,
      body: userNote,
    },
  };
};
export const hideUserNote = (noteId: number) => (dispatch) => {
  return dispatch(hideNote(noteId));
};

export const UNHIDE_USER_NOTE = 'UNHIDE_USER_NOTE';
export const UNHIDE_USER_NOTE_SUCCESS = 'UNHIDE_USER_NOTE_SUCCESS';
export const UNHIDE_USER_NOTE_FAILURE = 'UNHIDE_USER_NOTE_FAILURE';

const unhideNote = (id: number) => {
  const userNote = { id };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [UNHIDE_USER_NOTE, UNHIDE_USER_NOTE_SUCCESS, UNHIDE_USER_NOTE_FAILURE],
      endPoint: `user/note/show`,
      schema: Schemas.USER_NOTE,
      body: userNote,
    },
  };
};
export const unhideUserNote = (noteId: number) => (dispatch) => {
  return dispatch(unhideNote(noteId));
};

export const SEND_PUSH_TOKEN = 'SEND_PUSH_TOKEN';
export const SEND_PUSH_TOKEN_SUCCESS = 'SEND_PUSH_TOKEN_SUCCESS';
export const SEND_PUSH_TOKEN_FAILURE = 'SEND_PUSH_TOKEN_FAILURE';

const expoPushTokenSender = (pushToken) => {
  const tokenBody = { token: pushToken };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [SEND_PUSH_TOKEN, SEND_PUSH_TOKEN_SUCCESS, SEND_PUSH_TOKEN_FAILURE],
      endPoint: `user/expo-push-token`,
      schema: Schemas.PUSH_TOKEN,
      body: tokenBody,
    },
  };
};

export const sendPushToken = (pushToken) => (dispatch) => {
  return dispatch(expoPushTokenSender(pushToken));
};
