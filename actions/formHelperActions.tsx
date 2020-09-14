export const AUTOCOMPLETE_SELECTED = 'AUTOCOMPLETE_SELECTED';
export const DRIVER_AUTOCOMPLETE_SELECTED = 'DRIVER_AUTOCOMPLETE_SELECTED';

const autocompleteSelected = (id) => {
  return {
    type: AUTOCOMPLETE_SELECTED,
    id,
  };
};

export const interceptAutocompleteSelected = (id) => (dispatch) => {
  return dispatch(autocompleteSelected(id));
};

const driverAutoCompleteSelected = (id) => {
  return {
    type: DRIVER_AUTOCOMPLETE_SELECTED,
    id,
  };
};

export const interceptDriverAutoCompleteSelected = (id) => (dispatch, getState) => {
  return dispatch(driverAutoCompleteSelected(id));
};

const autoCompleteForInternalForm = (itemIndex, id) => {
  return {
    type: AUTOCOMPLETE_SELECTED,
    itemIndex,
    id,
  };
};

export const interceptAutoCompleteForInternalForm = (itemIndex, id) => (dispatch, getState) => {
  return dispatch(autoCompleteForInternalForm(itemIndex, id));
};
