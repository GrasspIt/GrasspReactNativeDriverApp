import { createSelector } from 'reselect';
import { State } from '../store/reduxStoreState';

// const NullLoggedInUserEntities = {
//     users: {}
// }

export const getLoggedInUserId = (state: State) => state.api.loggedInUserId;
export const getLoggedInUser = (state: State) =>
  state.api.loggedInUserId ? state.api.entities.users[state.api.loggedInUserId] : undefined;

// export const getLoggedInUserEntities = (state: State) => {
//     return state.api.entities.users || NullLoggedInUserEntities;
// };

// export const getLoggedInUser = (state: State) => getLoggedInUserEntities(state)[getLoggedInUserId(state)];

export const getUnverifiedUsers = (state: State) => state.api.entities.unverifiedUsers;
export const getSearchUsers = (state: State) => state.api.entities.searchUsers;
export const getUsers = (state: State) => state.api.entities.users;

export const getUsersByName = createSelector([getUsers], (users) => {
  if (!users) return [];
  return Object.keys(users)
    .map((key: any) => users[key])
    .map((user) => ({
      value: user.id,
      text: user.firstName + ' ' + user.lastName + ' (' + user.email + ')',
    }));
});

export const getUserFromProps = (state: State, props: any) => {
  const users = state.api.entities.users;
  return users && props && props.userId ? users[props.userId] : null;
};

export const getUserNotesFromProps = (state: State, props: any) => {
  const userNotes = state.api.entities.userNotes;
  const users = state.api.entities.users;
  const user = users[props.userId];
  return userNotes && users && props.userId && user && user.userNotes
    ? user.userNotes.map((key: any) => userNotes[key])
    : null;
};
