import { State } from '../store/reduxStoreState';

export const getUserMedicalRecommendations = (state: State) =>
  state.api.entities.usersMedicalRecommendations;
export const getUserIdDocuments = (state: State) => state.api.entities.usersIdDocuments;

export const getUserIdDocumentFromProps = (state: State, props) => {
  return state.api.entities.users &&
    state.api.entities.usersIdDocuments &&
    state.api.entities.users[props.userId]
    ? state.api.entities.usersIdDocuments[
        state.api.entities.users[props.userId].identificationDocument
      ]
    : null;
};

export const getUserIdDocumentFromPropsWithOrder = (state: State, props) => {
  return state.api.entities.usersIdDocuments
    ? state.api.entities.users[props.userId]
      ? state.api.entities.usersIdDocuments[props.order.userIdentificationDocument]
      : null
    : null;
};

export const getUserMedicalRecommendationFromProps = (state: State, props) => {
  return state.api.entities.users && props.userId &&
    state.api.entities.users[props.userId] &&
    state.api.entities.users[props.userId].medicalRecommendation &&
    state.api.entities.usersMedicalRecommendations
    ? state.api.entities.usersMedicalRecommendations[
        state.api.entities.users[props.userId].medicalRecommendation
      ]
    : null;
};
