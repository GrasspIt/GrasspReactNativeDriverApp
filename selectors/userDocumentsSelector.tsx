import { State } from '../store/reduxStoreState';

export const getUserMedicalRecommendations = (state: State) =>
    state.api.entities.usersMedicalRecommendations;
export const getUserIdDocuments = (state: State) => state.api.entities.usersIdDocuments;

export const getUserIdDocumentFromProps = (state: State, props) => {
    if (state.api.entities.users && props.userId &&
    state.api.entities.usersIdDocuments &&
    state.api.entities.users[props.userId]) {
        const idDocumentId = state.api.entities.users[props.userId].identificationDocument ? state.api.entities.users[props.userId].identificationDocument : null;
        return idDocumentId ? state.api.entities.usersIdDocuments[idDocumentId] : null
    }
    return null;
};

export const getUserIdDocumentFromPropsWithOrder = (state: State, props) => {
    return state.api.entities.usersIdDocuments
        ? state.api.entities.users[props.userId]
            ? state.api.entities.usersIdDocuments[props.order.userIdentificationDocument]
            : null
        : null;
};

export const getUserMedicalRecommendationFromProps = (state: State, props) => {
    if (props.userId && state.api.entities.users && state.api.entities.usersMedicalRecommendations
        && state.api.entities.users[props.userId] && state.api.entities.users[props.userId].medicalRecommendation) {
        const medicalRecommendationId = state.api.entities.users[props.userId].medicalRecommendation
            ? state.api.entities.users[props.userId].medicalRecommendation
            : null;
        return medicalRecommendationId ? state.api.entities.usersMedicalRecommendations[medicalRecommendationId] : null
    }
    return null;

    //originally this code worked. However, typescript began throwing the error - undefined cannot be used as an index type.
    //thus, the overly cautious code above (a similar situation happened with getUserIdDocumentFromProps

    //return state.api.entities.users &&
    //state.api.entities.usersMedicalRecommendations &&
    //state.api.entities.users[props.userId]
    //    ? state.api.entities.usersMedicalRecommendations[
    //        state.api.entities.users[props.userId].medicalRecommendation
    //        ]
    //    : null;
};
