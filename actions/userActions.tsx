import { API_ROOT, CALL_API, Schemas } from '../middleware/api';

import * as SecureStore from 'expo-secure-store';

const accessTokenKey = SecureStore.getItemAsync('accessToken');

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_ALL_USERS_SUCCESS = 'GET_ALL_USERS_SUCCESS';
export const GET_ALL_USERS_FAILURE = 'GET_ALL_USERS_FAILURE';

const allUsers = () => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [GET_ALL_USERS, GET_ALL_USERS_SUCCESS, GET_ALL_USERS_FAILURE],
    endPoint: 'user/list',
    schema: Schemas.USER_ARRAY,
  },
});

export const getAllUsers = () => (dispatch) => {
  return dispatch(allUsers());
};

export const userListCSVDownloadLink = (begin, end) =>
  API_ROOT +
  `user/list/csv?begin=${begin}&end=${end}&access_token=${accessTokenKey}`;

export const downloadUnverifiedUsersList = () =>
  API_ROOT + `user/unverified/csv?access_token=${accessTokenKey}`;

export const GET_USERS_WITH_UNVERIFIED_DOCUMENTS =
  'GET_USERS_WITH_UNVERIFIED_DOCUMENTS';
export const GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS =
  'GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS';
export const GET_USERS_WITH_UNVERIFIED_DOCUMENTS_FAILURE =
  'GET_USERS_WITH_UNVERIFIED_DOCUMENTS_FAILURE';

const allUsersWithUnverifiedDocuments = () => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_USERS_WITH_UNVERIFIED_DOCUMENTS,
      GET_USERS_WITH_UNVERIFIED_DOCUMENTS_SUCCESS,
      GET_USERS_WITH_UNVERIFIED_DOCUMENTS_FAILURE,
    ],
    endPoint: 'user/unverified',
    schema: Schemas.UNVERIFIED_USER_ARRAY,
  },
});

export const getAllUsersWithUnverifiedDocuments = () => (dispatch) => {
  return dispatch(allUsersWithUnverifiedDocuments()).then((response) => {
    return response.response.result;
  });
};

export const GET_USERS_BY_SEARCH = 'GET_USERS_BY_SEARCH';
export const GET_USERS_BY_SEARCH_SUCCESS = 'GET_USERS_BY_SEARCH_SUCCESS';
export const GET_USERS_BY_SEARCH_FAILURE = 'GET_USERS_BY_SEARCH_FAILURE';

const usersBySearch = (searchQuery) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_USERS_BY_SEARCH,
      GET_USERS_BY_SEARCH_SUCCESS,
      GET_USERS_BY_SEARCH_FAILURE,
    ],
    endPoint: `user/search/${searchQuery}`,
    schema: Schemas.USER_SEARCH_ARRAY,
  },
});

export const getUsersBySearch = (searchQuery) => (dispatch) => {
  return dispatch(usersBySearch(searchQuery));
};

export const GET_SPECIFIC_USER = 'GET_SPECIFIC_USER';
export const GET_SPECIFIC_USER_SUCCESS = 'GET_SPECIFIC_USER_SUCCESS';
export const GET_SPECIFIC_USER_FAILURE = 'GET_SPECIFIC_USER_FAILURE';

const specificUser = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_SPECIFIC_USER,
      GET_SPECIFIC_USER_SUCCESS,
      GET_SPECIFIC_USER_FAILURE,
    ],
    endPoint: `user/${userId}`,
    schema: Schemas.USER,
  },
});

export const getSpecificUser = (userId) => (dispatch) => {
  return dispatch(specificUser(userId));
};

export const GET_ORDER_HISTORY_FOR_USER = 'GET_ORDER_HISTORY_FOR_USER';
export const GET_ORDER_HISTORY_FOR_USER_SUCCESS =
  'GET_ORDER_HISTORY_FOR_USER_SUCCESS';
export const GET_ORDER_HISTORY_FOR_USER_FAILURE =
  'GET_ORDER_HISTORY_FOR_USER_FAILURE';

const orderHistoryForUser = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_ORDER_HISTORY_FOR_USER,
      GET_ORDER_HISTORY_FOR_USER_SUCCESS,
      GET_ORDER_HISTORY_FOR_USER_FAILURE,
    ],
    endPoint: `order/history/user/all`,
    queryParamsMap: { user_id: userId },
    schema: Schemas.ORDER_ARRAY,
  },
});

export const getOrderHistoryForUser = (userId) => (dispatch) => {
  return dispatch(orderHistoryForUser(userId));
};

export const USER_ID_DOCUMENT = 'identification_document';
export const USER_MEDICAL_RECOMMENDATION = 'medical_recommendation';

export const GET_USER_ID_DOCUMENT = 'GET_USER_ID_DOCUMENT';
export const GET_USER_ID_DOCUMENT_SUCCESS = 'GET_USER_ID_DOCUMENT_SUCCESS';
export const GET_USER_ID_DOCUMENT_FAILURE = 'GET_USER_ID_DOCUMENT_FAILURE';

const userIdDocument = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_USER_ID_DOCUMENT,
      GET_USER_ID_DOCUMENT_SUCCESS,
      GET_USER_ID_DOCUMENT_FAILURE,
    ],
    endPoint: `user/${USER_ID_DOCUMENT}/${userId}`,
    schema: Schemas.USER_ID_DOCUMENT,
  },
});

export const getUserIdDocument = (userId) => (dispatch) => {
  return dispatch(userIdDocument(userId));
};

export const GET_ALL_USER_ID_DOCUMENTS = 'GET_ALL_USER_ID_DOCUMENTS';
export const GET_ALL_USER_ID_DOCUMENTS_SUCCESS =
  'GET_ALL_USER_ID_DOCUMENTS_SUCCESS';
export const GET_ALL_USER_ID_DOCUMENTS_FAILURE =
  'GET_ALL_USER_ID_DOCUMENTS_FAILURE';

const allUserIdDocuments = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_ALL_USER_ID_DOCUMENTS,
      GET_ALL_USER_ID_DOCUMENTS_SUCCESS,
      GET_ALL_USER_ID_DOCUMENTS_FAILURE,
    ],
    endPoint: `user/${USER_ID_DOCUMENT}/all/${userId}`,
    schema: Schemas.USER_ID_DOCUMENT_ARRAY,
  },
});

export const getAllUserIdDocuments = (userId) => (dispatch) => {
  return dispatch(allUserIdDocuments(userId));
};

export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';
export const SET_CURRENT_USER_ID_SUCCESS = 'SET_CURRENT_USER_ID_SUCCESS';
export const SET_CURRENT_USER_ID_FAILURE = 'SET_CURRENT_USER_ID_FAILURE';

const setIdDocument = (documentId: number) => ({
  [CALL_API]: {
    httpAction: 'POST',
    types: [
      SET_CURRENT_USER_ID,
      SET_CURRENT_USER_ID_SUCCESS,
      SET_CURRENT_USER_ID_FAILURE,
    ],
    endPoint: `user/${USER_ID_DOCUMENT}/current/${documentId}`,
    schema: Schemas.USER_ID_DOCUMENT,
  },
});

export const setUserIdDocument = (documentId: number) => (dispatch) => {
  return dispatch(setIdDocument(documentId));
};

export const GET_ALL_USER_MEDICAL_RECOMMENDATIONS =
  'GET_ALL_USER_MEDICAL_RECOMMENDATIONS';
export const GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS =
  'GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS';
export const GET_ALL_USER_MEDICAL_RECOMMENDATIONS_FAILURE =
  'GET_ALL_USER_MEDICAL_RECOMMENDATIONS_FAILURE';

const allUserMedicalRecommendations = (userId) => ({
  [CALL_API]: {
    httpAction: 'GET',
    types: [
      GET_ALL_USER_MEDICAL_RECOMMENDATIONS,
      GET_ALL_USER_MEDICAL_RECOMMENDATIONS_SUCCESS,
      GET_ALL_USER_MEDICAL_RECOMMENDATIONS_FAILURE,
    ],
    endPoint: `user/${USER_MEDICAL_RECOMMENDATION}/all/${userId}`,
    schema: Schemas.USER_MEDICAL_RECOMMENDATION_ARRAY,
  },
});

export const getAllUserMedicalRecommendations = (userId) => (dispatch) => {
  return dispatch(allUserMedicalRecommendations(userId));
};

export const SET_CURRENT_USER_MEDICAL_RECOMMENDATION =
  'SET_CURRENT_USER_MEDICAL_RECOMMENDATION';
export const SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS =
  'SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS';
export const SET_CURRENT_USER_MEDICAL_RECOMMENDATION_FAILURE =
  'SET_CURRENT_USER_MEDICAL_RECOMMENDATION_FAILURE';

const setMedicalRecommendation = (documentId: number) => ({
  [CALL_API]: {
    httpAction: 'POST',
    types: [
      SET_CURRENT_USER_MEDICAL_RECOMMENDATION,
      SET_CURRENT_USER_MEDICAL_RECOMMENDATION_SUCCESS,
      SET_CURRENT_USER_MEDICAL_RECOMMENDATION_FAILURE,
    ],
    endPoint: `user/${USER_MEDICAL_RECOMMENDATION}/current/${documentId}`,
    schema: Schemas.USER_MEDICAL_RECOMMENDATION,
  },
});

export const setUserMedicalRecommendation = (documentId: number) => (
  dispatch
) => {
  return dispatch(setMedicalRecommendation(documentId));
};

export const DSPR_TRANSFER = 'DSPR_TRANSFER';
export const DSPR_TRANSFER_SUCCESS = 'DSPR_TRANSFER_SUCCESS';
export const DSPR_TRANSFER_FAILURE = 'DSPR_TRANSFER_FAILURE';

const dsprTransfer = () => {
  const transfer = {
    oldDSPR: { id: 2 },
    newDeliveryServiceProvider: { id: 3 },
    newDSPRName: 'San Diego',
  };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [DSPR_TRANSFER, DSPR_TRANSFER_SUCCESS, DSPR_TRANSFER_FAILURE],
      endPoint: `dspr/transfer`,
      schema: Schemas.DSPR,
      body: transfer,
    },
  };
};

export const doDSPRTransfer = () => (dispatch) => {
  return dispatch(dsprTransfer());
};

export const GENERATE_REFERRALS = 'GENERATE_REFERRALS';
export const GENERATE_REFERRALS_SUCCESS = 'GENERATE_REFERRALS_SUCCESS';
export const GENERATE_REFERRALS_FAILURE = 'GENERATE_REFERRALS_FAILURE';

const generateReferrals = () => ({
  [CALL_API]: {
    httpAction: 'POST',
    types: [
      GENERATE_REFERRALS,
      GENERATE_REFERRALS_SUCCESS,
      GENERATE_REFERRALS_FAILURE,
    ],
    endPoint: `referral/generate-referral-codes`,
    schema: Schemas.EMPTY, // <-- needs attention. A new Schema is added with an empty array, might break things.
    // This function also doesn't seemed to be used anywhere
  },
});

export const doGenerateReferrals = () => (dispatch) => {
  return dispatch(generateReferrals());
};

export const GET_USER_MEDICAL_RECOMMENDATION =
  'GET_USER_MEDICAL_RECOMMENDATION';
export const GET_USER_MEDICAL_RECOMMENDATION_SUCCESS =
  'GET_USER_MEDICAL_RECOMMENDATION_SUCCES';
export const GET_USER_MEDICAL_RECOMMENDATION_FAILURE =
  'GET_USER_MEDICAL_RECOMMENDATION_FAILURE';

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

export const VERIFY_USER_DOCUMENT = 'VERIFY_USER_DOCUMENT';
export const VERIFY_USER_DOCUMENT_SUCCESS = 'VERIFY_USER_DOCUMENT_SUCCESS';
export const VERIFY_USER_DOCUMENT_FAILURE = 'VERIFY_USER_DOCUMENT_FAILURE';

const userDocumentVerification = (
  userId,
  documentId,
  documentType,
  document
) => {
  document.user = { id: userId };
  document.id = documentId;
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        VERIFY_USER_DOCUMENT,
        VERIFY_USER_DOCUMENT_SUCCESS,
        VERIFY_USER_DOCUMENT_FAILURE,
      ],
      endPoint: `user/${documentType}/verify`,
      schema:
        documentType === USER_ID_DOCUMENT
          ? Schemas.USER_ID_DOCUMENT
          : Schemas.USER_MEDICAL_RECOMMENDATION,
      body: document,
    },
  };
};

export const verifyUserDocument = (
  userId,
  documentId,
  documentType,
  document
) => (dispatch) => {
  return dispatch(
    userDocumentVerification(userId, documentId, documentType, document)
  );
};

export const ADMIN_CHANGES_USER_DETAILS = 'ADMIN_CHANGES_USER_DETAILS';
export const ADMIN_CHANGES_USER_DETAILS_SUCCESS =
  'ADMIN_CHANGES_USER_DETAILS_SUCCESS';
export const ADMIN_CHANGES_USER_DETAILS_FAILURE =
  'ADMIN_CHANGES_USER_DETAILS_FAILURE';

const adminUserInfoChanger = (
  userId,
  newFirstName,
  newLastName,
  newPhoneNumber
) => {
  const userInfoBody = {
    id: userId,
    firstName: newFirstName,
    lastName: newLastName,
    phoneNumber: newPhoneNumber,
  };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ADMIN_CHANGES_USER_DETAILS,
        ADMIN_CHANGES_USER_DETAILS_SUCCESS,
        ADMIN_CHANGES_USER_DETAILS_FAILURE,
      ],
      endPoint: `user/admin-change-user-details`,
      schema: Schemas.USER,
      body: userInfoBody,
    },
  };
};

export const adminChangesUserInfo = (
  userId,
  newFirstName,
  newLastName,
  newPhoneNumber
) => (dispatch, getState) => {
  return dispatch(
    adminUserInfoChanger(userId, newFirstName, newLastName, newPhoneNumber)
  );
};
export const ADMIN_CHANGES_PASSWORD = 'ADMIN_CHANGES_PASSWORD';
export const ADMIN_CHANGES_PASSWORD_SUCCESS = 'ADMIN_CHANGES_PASSWORD_SUCCESS';
export const ADMIN_CHANGES_PASSWORD_FAILURE = 'ADMIN_CHANGES_PASSWORD_FAILURE';

const adminPasswordChanger = (userId, newPassword) => {
  const passwordChanger = { user: { id: userId }, newPassword };
  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ADMIN_CHANGES_PASSWORD,
        ADMIN_CHANGES_PASSWORD_SUCCESS,
        ADMIN_CHANGES_PASSWORD_FAILURE,
      ],
      endPoint: `user/admin-change-password`,
      schema: Schemas.USER,
      body: passwordChanger,
    },
  };
};

export const adminChangesPassword = (userId, newPassword) => (
  dispatch,
  getState
) => {
  return dispatch(adminPasswordChanger(userId, newPassword));
};

export const ADMIN_CHANGES_PHONE = 'ADMIN_CHANGES_PHONE';
export const ADMIN_CHANGES_PHONE_SUCCESS = 'ADMIN_CHANGES_PHONE_SUCCESS';
export const ADMIN_CHANGES_PHONE_FAILURE = 'ADMIN_CHANGES_PHONE_FAILURE';

const adminPhoneChanger = (userId, newPhone) => {
  const phoneChanger = { id: userId, phoneNumber: newPhone };

  return {
    [CALL_API]: {
      httpAction: 'POST',
      types: [
        ADMIN_CHANGES_PHONE,
        ADMIN_CHANGES_PHONE_SUCCESS,
        ADMIN_CHANGES_PHONE_FAILURE,
      ],
      endPoint: `user/admin-change-phone`,
      schema: Schemas.USER,
      body: phoneChanger,
    },
  };
};

export const adminChangesPhone = (userId, newPhone) => (dispatch, getState) => {
  return dispatch(adminPhoneChanger(userId, newPhone));
};

export const UPLOAD_USER_DOCUMENT = 'UPLOAD_USER_DOCUMENT';
export const UPLOAD_USER_DOCUMENT_SUCCESS = 'UPLOAD_USER_DOCUMENT_SUCCESS';
export const UPLOAD_USER_DOCUMENT_FAILURE = 'UPLOAD_USER_DOCUMENT_FAILURE';

const userDocumentUploader = (userId, docType, imageFile) => {
  const userDocument = {
    user: { id: userId },
    fileName: imageFile.name,
  };

  switch (docType) {
    case USER_ID_DOCUMENT:
    case USER_MEDICAL_RECOMMENDATION:
      return {
        [CALL_API]: {
          httpAction: 'POST',
          types: [
            UPLOAD_USER_DOCUMENT,
            UPLOAD_USER_DOCUMENT_SUCCESS,
            UPLOAD_USER_DOCUMENT_FAILURE,
          ],
          endPoint: `user/${docType}`,
          schema:
            docType === USER_ID_DOCUMENT
              ? Schemas.USER_ID_DOCUMENT
              : Schemas.USER_MEDICAL_RECOMMENDATION,
          body: userDocument,
          file: imageFile,
        },
      };
    default:
      throw new Error('Invalid document type.');
  }
};

export const uploadUserDocument = (userId, docType, imageFile) => (
  dispatch,
  getState
) => {
  return dispatch(userDocumentUploader(userId, docType, imageFile)).then(() =>
    dispatch(getSpecificUser(userId))
  );
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
          types: [
            HIDE_USER_DOCUMENT,
            HIDE_USER_DOCUMENT_SUCCESS,
            HIDE_USER_DOCUMENT_FAILURE,
          ],
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

export const hideUserDocument = (documentId, docType) => (
  dispatch,
  getState
) => {
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
          types: [
            UNHIDE_USER_DOCUMENT,
            UNHIDE_USER_DOCUMENT_SUCCESS,
            UNHIDE_USER_DOCUMENT_FAILURE,
          ],
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

export const unhideUserDocument = (documentId, docType) => (
  dispatch,
  getState
) => {
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
      throw new Error(
        'Cannot have both dsprDriverId and dsprManagerId when creating a userNote'
      );
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
      types: [
        CREATE_USER_NOTE,
        CREATE_USER_NOTE_SUCCESS,
        CREATE_USER_NOTE_FAILURE,
      ],
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
      types: [HIDE_USER_NOTE, HIDE_USER_NOTE_SUCCESS, HIDE_USER_NOTE_FAILURE],
      endPoint: `user/note/show`,
      schema: Schemas.USER_NOTE,
      body: userNote,
    },
  };
};
export const unhideUserNote = (noteId: number) => (dispatch) => {
  return dispatch(unhideNote(noteId));
};
