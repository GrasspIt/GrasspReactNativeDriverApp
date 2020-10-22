import { State } from '../store/reduxStoreState';
import { createSelector } from 'reselect';
import { getLocations } from './dsprDriverLocationSelectors';
import { getOrders, getOrdersWithAddresses } from './orderSelectors';
import { getAddresses } from './addressSelectors';
import { getUsers } from './userSelectors';
import { getUserMedicalRecommendations, getUserIdDocuments } from './userDocumentsSelector';

export const getRouteMetrics = (state: State) => state.api.entities.dsprDriverRouteMetrics;

export const getRouteLocations = (state: State) => state.api.entities.dsprDriverRouteLocations;

export const getRoutes = (state: State) => state.api.entities.dsprDriverRoutes;

export const getRouteById = (state: State, props) => state.api.entities.dsprDriverRoutes[props.id];

export const getRouteLegs = (state: State) => state.api.entities.dsprDriverRouteLegs;

export const getRouteLegDirections = (state: State) =>
  state.api.entities.dsprDriverRouteLegDirections;

export const getRouteLegsWithOrdersWithAddresses = createSelector(
  [getRouteLegs, getOrdersWithAddresses],
  (routeLegs, orders) => {
    let routeLegsWithOrders = {};

    if (routeLegs) {
      if (orders) {
        Object.values(routeLegs).forEach((routeLeg) => {
          routeLegsWithOrders[routeLeg.id] = { ...routeLeg, order: orders[routeLeg.order] };
        });
      } else {
        routeLegsWithOrders = routeLegs;
      }
    } else {
      routeLegsWithOrders;
    }

    return routeLegsWithOrders;
  }
);

export const getRoutesWithMetricsAndLocations = createSelector(
  [getRoutes, getRouteMetrics, getRouteLocations, getLocations],
  (routes, metrics, locations, driverLocations) => {
    if (routes) {
      if (metrics) {
        if (locations) {
          const filledLegs = {};
          if (driverLocations) {
            Object.values(routes).forEach((route) => {
              filledLegs[route.id] = {
                ...route,
                metrics: metrics[route.metrics],
                startLocation: locations[route.startLocation],
                initialDriverLocation: driverLocations[route.initialDriverLocation],
                endLocation: locations[route.endLocation],
                // overviewPolyline: route.overviewPolyline.map(location => locations[location]),
                polylineContainingCoordinates: route.polylineContainingCoordinates.map(
                  (location) => locations[location]
                ),
              };
            });
          } else {
            Object.values(routes).forEach((route) => {
              filledLegs[route.id] = {
                ...route,
                metrics: metrics[route.metrics],
                startLocation: locations[route.startLocation],
                endLocation: locations[route.endLocation],
                // overviewPolyline: route.overviewPolyline.map(location => locations[location]),
                polylineContainingCoordinates: route.polylineContainingCoordinates.map(
                  (location) => locations[location]
                ),
              };
            });
          }
          return filledLegs;
        } else {
          const routeKeys = Object.keys(routes);
          for (let i = 0; i < routeKeys.length; ++i) {
            routes[routeKeys[i]].metrics = metrics[routes[routeKeys[i]].metrics];
          }
          return routes;
        }
      } else {
        return routes;
      }
    } else {
      return undefined;
    }
  }
);

export const getRouteLegsWithMetricsAndLocations = createSelector(
  [getRouteLegs, getRouteMetrics, getRouteLocations],
  (legs, metrics, locations) => {
    if (legs) {
      if (metrics) {
        if (locations) {
          const filledLegs = {};
          Object.values(legs).forEach((leg) => {
            filledLegs[leg.id] = {
              ...leg,
              metrics: metrics[leg.metrics],
              startLocation: locations[leg.startLocation],
              endLocation: locations[leg.endLocation],
            };
          });
          return filledLegs;
        } else {
          const legKeys = Object.keys(legs);
          for (let i = 0; i < legKeys.length; ++i) {
            legs[legKeys[i]].metrics = metrics[legs[legKeys[i]].metrics];
          }
          return legs;
        }
      } else {
        return legs;
      }
    } else {
      return undefined;
    }
  }
);

const mapAddressIntoOrder = (orderId, orders, addresses, users, medRecs, idDocs) => {
  if (!orderId) return null;
  let order = orders[orderId];
  if (!order) {
    return null;
  }
  let user = users[order.user] || order.user;
  const returnOrder = { ...order, address: addresses[order.address], user };
  if (order.userMedicalRecommendation)
    returnOrder['medicalRecommendation'] = medRecs[order.userMedicalRecommendation];
  if (order.userIdentificationDocument)
    returnOrder['userIdentificationDocument'] = idDocs[order.userIdentificationDocument];
  return returnOrder;
};

export const getRouteLegsWithMetricsAndLocationsAndOrdersWithAddressesAndUsers = createSelector(
  [
    getRouteLegsWithMetricsAndLocations,
    getOrders,
    getAddresses,
    getUsers,
    getUserMedicalRecommendations,
    getUserIdDocuments,
  ],
  (routeLegs, orders, addresses, users, medRecs, idDocs) => {
    let completeRouteLegs = {};
    if (routeLegs) {
      if (orders && addresses && users && medRecs && idDocs) {
        Object.values(routeLegs).forEach((routeLeg) => {
          completeRouteLegs[routeLeg.id] = {
            ...routeLeg,
            order: mapAddressIntoOrder(routeLeg.order, orders, addresses, users, medRecs, idDocs),
          };
        });
      }
    } else {
      completeRouteLegs;
    }

    return completeRouteLegs;
  }
);

export const getRouteLegDirectionsWithMetricsAndLocations = createSelector(
  [getRouteLegDirections, getRouteMetrics, getRouteLocations],
  (legDirections, metrics, locations) => {
    if (legDirections) {
      if (metrics) {
        if (locations) {
          const filledLegDirections = {};
          Object.values(legDirections).forEach((legDirection) => {
            filledLegDirections[legDirection.id] = {
              ...legDirection,
              metrics: metrics[legDirection.metrics],
              startLocation: locations[legDirection.startLocation],
              endLocation: locations[legDirection.endLocation],
              // overviewPolyline: legDirection.overviewPolyline.map(
              //   (location) => locations[location]
              // ),
            };
          });
          return filledLegDirections;
        } else {
          const legDirectionKeys = Object.keys(legDirections);
          for (let i = 0; i < legDirectionKeys.length; ++i) {
            legDirections[legDirectionKeys[i]].metrics =
              metrics[legDirections[legDirectionKeys[i]].metrics];
          }
          return legDirections;
        }
      } else {
        return legDirections;
      }
    } else {
      return undefined;
    }
  }
);

export const getRouteWithMetricsAndLocationsById = createSelector(
  [getRouteById, getRouteMetrics, getRouteLocations],
  (route, metrics, locations) =>
    route
      ? metrics
        ? locations
          ? {
              ...route,
              metrics: metrics[route.metrics],
              startLocation: locations[route.startLocation],
              endLocation: locations[route.endLocation],
              overviewPolyline: route.overviewPolyline.map((location) => locations[location]),
              polylineContainingCoordinates: route.polylineContainingCoordinates.map(
                (location) => locations[location]
              ),
            }
          : {
              ...route,
              metrics: metrics[route.metrics],
            }
        : route
      : undefined
);

export const getRouteWithMetricsAndLocationsAndRouteLegsAndRouteLegDirectionsById = createSelector(
  [
    getRouteWithMetricsAndLocationsById,
    getRouteLegsWithMetricsAndLocationsAndOrdersWithAddressesAndUsers,
    getRouteLegDirectionsWithMetricsAndLocations,
  ],
  (route, legs, directions) =>
    route
      ? legs
        ? directions
          ? {
              ...route,
              legs: route.legs.map((legId) => ({
                ...legs[legId],
                routeLegDirections: legs[legId].routeLegDirections.map(
                  (legDirectionId) => directions[legDirectionId]
                ),
              })),
            }
          : {
              ...route,
              legs: route.legs.map((legId) => legs[legId]),
            }
        : route
      : undefined
);

export const getRoutesWithMetricsAndLocationsAndRouteLegsAndRouteLegDirections = createSelector(
  [
    getRoutesWithMetricsAndLocations,
    getRouteLegsWithMetricsAndLocationsAndOrdersWithAddressesAndUsers,
    getRouteLegDirectionsWithMetricsAndLocations,
  ],
  (routes, legs, directions) => {
    if (routes) {
      if (legs) {
        if (directions) {
          const filledRoutes = {};
          Object.values(routes).forEach((route) => {
            filledRoutes[route.id] = {
              ...route,
              legs: route.legs.map((legId) => ({
                ...legs[legId],
                routeLegDirections: legs[legId].routeLegDirections.map(
                  (legDirectionId) => directions[legDirectionId]
                ),
              })),
            };
          });
          return filledRoutes;
        } else {
          const routeKeys = Object.keys(routes);
          for (let i = 0; i < routeKeys.length; i++) {
            routes[routeKeys[i]].legs.map((legId) => legs[legId]);
          }
          return routes;
        }
      } else {
        return routes;
      }
    } else {
      return undefined;
    }
  }
);
