import { createSelector } from 'reselect';
import { getDSPFromProps } from './dspSelectors';
import { State } from '../store/reduxStoreState';

export const getDSPProducts = (state: State) => {
  return state.api.entities.dspProducts;
};

export const getSearchProducts = (state: State) => {
  return state.api.entities.searchProducts;
};

export const getDSPProductFromProps = (state: State, props) => {
  return state.api.entities.dspProducts && props && props.productId
    ? state.api.entities.dspProducts[props.productId]
    : null;
};

export const getProductsForDSP = createSelector(
  [getDSPFromProps, getDSPProducts],
  (deliveryServiceProvider, dspProducts) => {
    return deliveryServiceProvider
      ? deliveryServiceProvider.products
        ? dspProducts
          ? deliveryServiceProvider.products.map((productId) => dspProducts[productId])
          : []
        : []
      : undefined;
  }
);

export const getProductsForDSPForAutoSelect = createSelector([getProductsForDSP], (products) => {
  return products
    ? products.map((product) => {
        return { value: product.id, text: product.name };
      })
    : [];
});

const getDSPProductCategories = (state: State) => state.api.entities.dspProductCategories;

export const getProductCategoriesForDSP = createSelector(
  [getDSPFromProps, getDSPProductCategories],
  (dsp, categories) => {
    return dsp
      ? categories
        ? dsp.productCategories
          ? dsp.productCategories.map((id) => categories[id])
          : []
        : undefined
      : undefined;
  }
);

export const getProductCategoriesForDSPFromProps = createSelector(
  [getDSPFromProps, getDSPProductCategories],
  (dsp, categories) => {
    return dsp
      ? categories
        ? Object.values(categories).filter(
            (category) => category.deliveryServiceProvider === dsp.id
          )
        : undefined
      : undefined;
  }
);
