import { createSelector } from 'reselect';
// import { getDSPFromProps } from './dspSelectors';
// import { getOrders } from './orderSelectors';
// import { getAddresses } from './addressSelectors';
import { getUsers } from './userSelectors';
import { State } from '../store/reduxStoreState';
// import {getProductCategoriesForDSPFromProps} from './dspProductSelector'

const getDSPRDrivers = (state: State) => state.api.entities.dsprDrivers;

export const getDSPRs = (state: State) => state.api.entities.DSPRs;

export const getDSPRFromProps = (state: State, props) => state.api.entities.DSPRs[props.dsprId];

export const getDSPRPromotionsForProductCategories = (state: State, props) =>
  state.api.entities.dsprProductCategoryPromotions
    ? Object.values(state.api.entities.dsprProductCategoryPromotions).filter(
        (promotion) => promotion.dspr === parseInt(props.dsprId)
      )
    : undefined;

export const getAwayMessageForDSPRWithProps = (state: State, props) => {
  const dspr = getDSPRFromProps(state, props);
  return dspr && dspr.dsprAwayMessage && dspr.dsprAwayMessage.message;
};

const getDSPROrderHistories = (state: State) => state.api.entities.dsprOrderHistories;

// export const getDSPRsForDSP = createSelector(
//     [getDSPRs, getDSPFromProps], (dsprs, dsp) => {
//         if (!dsprs || !dsp) return [];
//         return Object.keys(dsprs).filter(key => dsprs[key].deliveryServiceProvider === dsp.id).map(key => dsprs[key]);
//     }
// );

// export const getOrderOfProductCategoriesFromProps = createSelector(
//     [getProductCategoriesForDSPFromProps], (productCategories) => {
//         const categoriesOrderMap = {};
//         if (productCategories) productCategories.map(productCategory => categoriesOrderMap[productCategory.id] = productCategory.order)
//         return categoriesOrderMap;
//     }
// )

// export const getActiveProductCategoriesForDSPFromPropsWithProductCategoryPromotions = createSelector(
//     [getProductCategoriesForDSPFromProps, getDSPRPromotionsForProductCategories], (productCategories, productCategoryPromotions) => {
//         return productCategories ?
//             productCategoryPromotions ?
//                 productCategories.map(productCategory => ({...productCategory, currentPromotion: productCategoryPromotions.find(promotion=> promotion.current && promotion.productCategory === productCategory.id)}))
//                 :undefined
//             :undefined
//     }
// )

// export const getOutstandingOrdersForDSPR = createSelector(
//     [getDSPRFromProps, getOrders, getAddresses, getUsers], (dspr, orders, addresses, users) => {
//         return dspr ?
//             dspr.outstandingOrders ?
//                 orders ?
//                     addresses ?
//                         dspr.outstandingOrders.map(orderId => {
//                             let order = orders[orderId];
//                             return { ...order, address: addresses[order.address], user: users[order.user] }
//                         })
//                         : []
//                     : []
//                 : []
//             : [];
//     }
// );

// export const getOrderHistoryForDSPR = createSelector(
//     [getDSPRFromProps, getOrders, getDSPROrderHistories, getAddresses, getUsers, getDSPRDrivers], (dspr, orders, dsprOrderHistories, addresses, users, dsprDrivers) => {
//         return dspr ?
//             dsprOrderHistories ?
//                 dsprOrderHistories[dspr.id] ?
//                     orders ?
//                         addresses ?
//                             users ?
//                                 dsprDrivers ?
//                                     dsprOrderHistories[dspr.id].orders.map(orderId => {
//                                         const order = orders[orderId];
//                                         return { ...order, address: addresses[order.address], user: users[order.user], driver: users[dsprDrivers[order.dsprDriver].user] }
//                                     })
//                                     : undefined
//                                 : undefined
//                             : undefined
//                         : undefined
//                     : undefined
//                 : undefined
//             : undefined;
//     }
// );
