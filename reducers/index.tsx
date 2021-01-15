import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import api from './apiReducer';
import { AUTOCOMPLETE_SELECTED, DRIVER_AUTOCOMPLETE_SELECTED } from '../actions/formHelperActions';

const userAutoCompleteSelected = (state, action) => {
  switch (action.type) {
    case AUTOCOMPLETE_SELECTED:
      return {
        ...state,
        values: {
          ...state.values,
          userId: action.id,
        },
      };
    default:
      return state;
  }
};

const productAutoCompleteSelected = (state, action) => {
  switch (action.type) {
    case AUTOCOMPLETE_SELECTED:
      return {
        ...state,
        values: {
          ...state.values,
          productId: action.id,
        },
      };
    case DRIVER_AUTOCOMPLETE_SELECTED:
      return {
        ...state,
        values: {
          ...state.values,
          driverId: action.id,
        },
      };
    default:
      return state;
  }
};

const productCategoryAutoCompleteSelected = (state, action) => {
  switch (action.type) {
    case AUTOCOMPLETE_SELECTED:
      return {
        ...state,
        values: {
          ...state.values,
          productCategoryId: action.id,
        },
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  form: formReducer.plugin({
    DSPForm: (state, action) => {
      if (state) return userAutoCompleteSelected(state, action);
    },
    DSPRForm: (state, action) => {
      if (state) return userAutoCompleteSelected(state, action);
    },
    CouponForm: (state, action) => {
      if (state) return userAutoCompleteSelected(state, action);
    },
    DSPRZipCodeForm: (state, action) => {
      if (state) return userAutoCompleteSelected(state, action);
    },
    DSPRDriverForm: (state, action) => {
      if (state) return userAutoCompleteSelected(state, action);
    },
    DSPRInventoryTransactionForm: (state, action) => {
      if (state) return productAutoCompleteSelected(state, action);
    },
    AddDriverInventoryToInventoryPeriodForm: (state, action) => {
      if (state) return productAutoCompleteSelected(state, action);
    },
    DSPRCreateProductCategoryPromotionForm: (state, action) => {
      if (state) return productCategoryAutoCompleteSelected(state, action);
    },
  }),
  api,
});

export default rootReducer;
