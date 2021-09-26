import { createSelector } from 'reselect';
import { getDSPRFromProps } from './dsprSelectors';
import { getUsers, getLoggedInUser } from './userSelectors';
import { getLocations } from './dsprDriverLocationSelectors';
import { getDSPProducts } from './dspProductSelector';
import { getOrders } from './orderSelectors';
import { getAddresses } from './addressSelectors';
import { getUserMedicalRecommendations, getUserIdDocuments } from './userDocumentsSelector';
import { getDSPRDriverServiceAreasFromProps } from './dsprDriverServiceAreaSelectors';
import { getRoutesWithMetricsAndLocationsAndRouteLegsAndRouteLegDirections } from './dsprDriverRouteSelectors';
import { State } from '../store/reduxStoreState';

export const getDSPRDrivers = (state: State, props) => state.api.entities.dsprDrivers;
export const getDSPRDriverFromProps = (state: State, props) =>
  state.api.entities.dsprDrivers[props.dsprDriverId];

const mapAddressIntoOrder = (orderId, orders, addresses, users, medRecs, idDocs) => {
  if (!orderId) return null;
  let order = orders[orderId];
  let user = users[order.user];
  const returnOrder = { ...order, address: addresses[order.address], user };
  if (order.userMedicalRecommendation)
    returnOrder['medicalRecommendation'] = medRecs[order.userMedicalRecommendation];
  if (order.userIdentificationDocument)
    returnOrder['userIdentificationDocument'] = idDocs[order.userIdentificationDocument];
  return returnOrder;
};

export const getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps = createSelector(
  [
    getDSPRDriverFromProps,
    getUsers,
    getLocations,
    getOrders,
    getAddresses,
    getUserMedicalRecommendations,
    getUserIdDocuments,
    getDSPRDriverServiceAreasFromProps,
    getRoutesWithMetricsAndLocationsAndRouteLegsAndRouteLegDirections,
  ],
  (driver, users, locations, orders, addresses, medicalRecs, idDocs, serviceAreas, routes) => {
    const completeDriver: any = driver
      ? users
        ? locations && orders && addresses && driver.currentLocation
          ? driver.queuedOrders
            ? {
                ...driver,
                user: users[driver.user],
                currentLocation: locations[driver.currentLocation],
                queuedOrders: driver.queuedOrders.map((orderId) =>
                  mapAddressIntoOrder(orderId, orders, addresses, users, medicalRecs, idDocs)
                ),
                currentInProcessOrder: mapAddressIntoOrder(
                  driver.currentInProcessOrder,
                  orders,
                  addresses,
                  users,
                  medicalRecs,
                  idDocs
                ),
              }
            : {
                ...driver,
                user: users[driver.user],
                currentLocation: locations[driver.currentLocation],
              }
          : { ...driver, user: users[driver.user] }
        : driver
      : null;

    if (driver && driver.serviceAreas) {
      completeDriver.serviceAreas = driver.serviceAreas.map(
        (serviceAreaId) => serviceAreas[serviceAreaId]
      );
    }
    if (routes && driver && driver.currentRoute) {
      completeDriver.currentRoute = routes[driver.currentRoute];
    }

    return completeDriver;
  }
);

export const getDSPRDriverWithUserAndOrdersFromProps = createSelector(
  [
    getDSPRDriverFromProps,
    getUsers,
    getLocations,
    getOrders,
    getAddresses,
    getUserMedicalRecommendations,
    getUserIdDocuments,
  ],
  (driver, users, locations, orders, addresses, medicalRecs, idDocs) => {
    return driver
      ? users
        ? locations && driver.currentLocation
          ? orders && addresses && driver.queuedOrders
            ? {
                ...driver,
                user: users[driver.user],
                currentLocation: locations[driver.currentLocation],
                queuedOrders: driver.queuedOrders.map((orderId) =>
                  mapAddressIntoOrder(orderId, orders, addresses, users, medicalRecs, idDocs)
                ),
                currentInProcessOrder: mapAddressIntoOrder(
                  driver.currentInProcessOrder,
                  orders,
                  addresses,
                  users,
                  medicalRecs,
                  idDocs
                ),
              }
            : {
                ...driver,
                user: users[driver.user],
                currentLocation: locations[driver.currentLocation],
              }
          : { ...driver, user: users[driver.user] }
        : driver
      : null;
  }
);

export const getDriversForDSPR = createSelector(
  [getDSPRFromProps, getDSPRDrivers, getUsers],
  (dspr, dsprDrivers, users) => {
    return dspr
      ? dspr.drivers
        ? dsprDrivers
          ? dspr.drivers
              .map((driverId) => dsprDrivers[driverId])
              .map((driver) => {
                return { ...driver, user: users[driver.user] };
              })
          : []
        : []
      : undefined;
  }
);

export const getOnCallDriversForDSPR = createSelector(
  [getDSPRFromProps, getDSPRDrivers, getUsers, getLocations],
  (dspr, dsprDrivers, users, locations) => {
    return dspr
      ? dspr.drivers
        ? dsprDrivers
          ? dspr.drivers
              .map((driverId) => dsprDrivers[driverId])
              .filter((driver) => driver.onCall)
              .map((driver) => {
                return {
                  ...driver,
                  user: users[driver.user],
                  location: driver.currentLocation ? locations[driver.currentLocation] : null,
                };
              })
          : []
        : []
      : undefined;
  }
);

export const getDrivers = (state: State) => {
  return state.api.entities.dsprDrivers;
};

export const getOnCallDrivers = createSelector([getDriversForDSPR], (drivers) => {
  return drivers ? drivers.filter((driver) => driver.onCall) : [];
});

export const getDriverForLoggedInUserGivenDSPR = createSelector(
  [getDSPRFromProps, getDrivers, getLoggedInUser],
  (dspr, drivers, loggedInUser) => {
    try {
      return dspr && dspr.drivers
        ? dspr.drivers
            .map((driverId) => drivers[driverId])
            .filter((driver) => driver.user === loggedInUser.id)[0]
        : undefined;
    } catch (e) {
      return undefined;
    }
  }
);

const getDriverInventoryPeriods = (state: State) => state.api.entities.dsprDriverInventoryPeriods;
const getDriverInventoryItems = (state: State) => state.api.entities.dsprDriverInventoryItems;

export const getDriverInventoryPeriodFromProps = (state: State, props) =>
  state.api.entities.dsprDriverInventoryPeriods[props.dsprDriverInventoryPeriodId];

export const getCurrentDriverInventoryPeriodForDriverFromProps = createSelector(
  [getDriverInventoryPeriods, getDSPRDriverFromProps, getDriverInventoryItems, getDSPProducts],
  (inventoryPeriods, driver, inventoryItems, products) => {
    const inventoryPeriod = driver
      ? inventoryPeriods
        ? driver.currentInventoryPeriod && inventoryPeriods[driver.currentInventoryPeriod]
        : undefined
      : undefined;
    const items = inventoryPeriod
      ? inventoryPeriod.dsprDriverInventoryItems.map((itemId) => {
          const item = inventoryItems[itemId];
          return { ...item, product: products[item.product] };
        })
      : undefined;
    return inventoryPeriod
      ? items
        ? { ...inventoryPeriod, dsprDriverInventoryItems: items }
        : inventoryPeriod
      : undefined;
  }
);
