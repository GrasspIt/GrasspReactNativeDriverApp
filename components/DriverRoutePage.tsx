import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, FlatList } from 'react-native';
import {
  DsprDriver,
  User,
  DsprDriverLocation,
  OrderWithAddressAndUser,
  Route,
  DSPRDriverServiceArea,
  DSPR,
  RouteLeg,
  RouteLegDirection,
  RouteMetrics,
} from '../store/reduxStoreState';
import { Button, Dialog, Card } from 'react-native-paper';
import { ListItem, Divider } from 'react-native-elements';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import Colors from '../constants/Colors';
import OrderItemBasic from './OrderItemBasic';

import { COMPLETE_ORDER_SUCCESS, MARK_IN_PROCESS_FAILURE } from '../actions/orderActions';
import {
  CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS,
  PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS,
} from '../actions/driverActions';

interface GettingStartedGoogleMapProps {
  driver: any;
  icons: any;
  orderPolyline: any;
  overviewPolyline: google.maps.LatLng[];
  currentlyActiveRouteLegIndex: number;
  toggleCallout?: any;
  handleMapOrderClick?: (order: any) => any;
  showCallout?: () => any;
}

const GettingStartedGoogleMap: React.FC<GettingStartedGoogleMapProps> = (props) => {
  const {
    driver,
    orderPolyline,
    overviewPolyline,
    currentlyActiveRouteLegIndex,
    toggleCallout,
    handleMapOrderClick,
    showCallout,
  } = props;
  //TODO: Will need to be set based on whether currentInProcessOrder exists or not
  const [onOverview, setOnOverview] = useState(true);
  const [mapZoomCalibrationStarted, setMapZoomCalibrationStarted] = useState(false);
  const [mapZoomCalibrationCompleted, setMapZoomCalibrationCompleted] = useState(false);
  const [hasClickedMarker, setHasClickedMarker] = useState(false);
  const [map, setMap] = useState(undefined);

  const handleOrderClick = (order) => {
    if (!hasClickedMarker) setHasClickedMarker(true);
    handleMapOrderClick(order);
  };

  const name = driver && driver.user && driver.user.firstName + ' ' + driver.user.lastName;

  const initials =
    driver &&
    driver.user &&
    driver.firstName &&
    driver.lastName &&
    driver.user.firstName.substring(0, 1) + driver.user.lastName.substring(0, 1);

  // marker for current location of driver
  const driverMarker = driver && driver.currentLocation && (
    <Marker
      onPress={toggleCallout}
      pinColor="green"
      title={initials}
      coordinate={{
        latitude: driver.currentLocation.latitude,
        longitude: driver.currentLocation.longitude,
      }}
    >
      {showCallout && (
        <Callout onPress={toggleCallout}>
          <Text>{name}</Text>
          <Text>
            Outstanding Orders:{' '}
            {driver.currentInProcessOrder
              ? driver.queuedOrders.length + 1
              : driver.queuedOrders.length}
          </Text>
        </Callout>
      )}
    </Marker>
  );

  // markers for orders in route
  const orderMarkers =
    driver &&
    driver.currentRoute &&
    driver.currentRoute.legs.length > 0 &&
    driver.currentRoute.legs
      .sort((a, b) => a.legOrder - b.legOrder)
      .map(
        (
          leg: Omit<RouteLeg, 'order'> & {
            order: OrderWithAddressAndUser;
          },
          index
        ) => {
          const orderForLeg = leg.order;
          const userInitials =
            orderForLeg &&
            orderForLeg.user &&
            orderForLeg.user.firstName &&
            orderForLeg.user.lastName &&
            orderForLeg.user.firstName.substring(0, 1) + orderForLeg.user.lastName.substring(0, 1);
          if (!orderForLeg || !orderForLeg.address) return null;
          return (
            <Marker
              coordinate={{
                latitude: orderForLeg.address.latitude,
                longitude: orderForLeg.address.longitude,
              }}
              {...orderForLeg}
              pinColor="red"
              title={userInitials || (++index).toString()}
              onPress={() => handleOrderClick(orderForLeg)}
              key={orderForLeg.address.id}
            />
          );
        }
      )
      .filter((marker) => marker != null);

  const mapOrderPolyline = orderPolyline && (
    <Polyline
      path={orderPolyline}
      visible={true}
      options={{
        path: orderPolyline,
        geodesic: true,
        strokeColor: '#03adfc',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      }}
    />
  );

  const mapOverviewPolyline = overviewPolyline && (
    <Polyline
      path={overviewPolyline}
      visible={true}
      options={{
        path: overviewPolyline,
        geodesic: true,
        strokeColor: '#03adfc',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      }}
    />
  );

  const findCenterPoint = () => {
    if (driver.currentRoute.polylineContainingCoordinates) {
      const containingCoords = driver.currentRoute.polylineContainingCoordinates;
      const centerLat =
        containingCoords[1].latitude +
        (containingCoords[0].latitude - containingCoords[1].latitude) / 2;
      const centerLong =
        containingCoords[1].longitude +
        (containingCoords[0].longitude - containingCoords[1].longitude) / 2;

      return { lat: centerLat, lng: centerLong };
    }
  };

  const findPolylineCenter = () => {
    if (orderPolyline) {
      const centerLat =
        orderPolyline[orderPolyline.length - 1].lat +
        (orderPolyline[0].lat - orderPolyline[orderPolyline.length - 1].lat) / 2;
      const centerLong =
        orderPolyline[orderPolyline.length - 1].lng +
        (orderPolyline[0].lng - orderPolyline[orderPolyline.length - 1].lng) / 2;

      return { lat: centerLat, lng: centerLong };
    }

    return null;
  };

  const findZoom = (containingCoords: any) => {
    const latLngCoords = containingCoords.map((coords) => {
      return {
        lat: coords.latitude || coords.lat,
        lng: coords.longitude || coords.lng,
      };
    });
    let zoom = (map && map.getZoom()) || 20;
    if (map && map.getBounds() && containingCoords && latLngCoords) {
      const bounds = map.getBounds();
      if (!(bounds.contains(latLngCoords[0]) && bounds.contains(latLngCoords[1]))) {
        --zoom;
        setMapZoomCalibrationStarted(true);
        map && map.setZoom(zoom);
      } else {
        setMapZoomCalibrationCompleted(true);
      }
    }
  };

  const toggleOnOverview = (setValue: boolean) => {
    setOnOverview(setValue);
    setMapZoomCalibrationStarted(false);
    setMapZoomCalibrationCompleted(false);
    map && map.setZoom(20);
  };

  useEffect(() => {
    if (orderPolyline) {
      toggleOnOverview(false);
    } else {
      toggleOnOverview(true);
    }
    // eslint-disable-next-line
  }, [orderPolyline]);

  useEffect(() => {
    if (currentlyActiveRouteLegIndex) {
      toggleOnOverview(false);
    }
    // eslint-disable-next-line
  }, [currentlyActiveRouteLegIndex]);

  // Use Longitude and Latitude of DSPR to set the location of the map if the driver's location isn't known
  const routeCenter =
    driver && driver.currentRoute
      ? findCenterPoint()
      : driver && driver.currentLocation
      ? { lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }
      : null;
  const polyLineCenter = driver && orderPolyline ? findPolylineCenter() : null;
  return (
    <MapView
      zoom={(map && map.getZoom()) || 20}
      center={
        polyLineCenter
          ? onOverview
            ? routeCenter
            : polyLineCenter
          : onOverview
          ? routeCenter
          : routeCenter || null
      }
      mapContainerStyle={{
        height: '500px',
        width: '100%',
      }}
      onLoad={(map) => setMap(map)}
      onUnmount={(map) => setMap(undefined)}
      onZoomChanged={() =>
        onOverview && !mapZoomCalibrationCompleted
          ? findZoom(driver.currentRoute.polylineContainingCoordinates)
          : !onOverview && !mapZoomCalibrationCompleted
          ? findZoom([orderPolyline[0], orderPolyline[orderPolyline.length - 1]])
          : null
      }
      onBoundsChanged={() => {
        if (!mapZoomCalibrationStarted && onOverview)
          driver.currentRoute && findZoom(driver.currentRoute.polylineContainingCoordinates);
        else if (!mapZoomCalibrationStarted && !onOverview)
          orderPolyline && findZoom([orderPolyline[0], orderPolyline[orderPolyline.length - 1]]);
        else if (!mapZoomCalibrationStarted && map && map.getZoom() === 20)
          findZoom(driver.currentRoute.polylineContainingCoordinates);
      }}
    >
      {driverMarker}
      {mapOrderPolyline
        ? !onOverview
          ? mapOrderPolyline
          : mapOverviewPolyline
        : mapOverviewPolyline}
      {orderMarkers && orderMarkers.length > 0 ? orderMarkers : undefined}
    </MapView>
  );
};

interface QueuedOrderProps {
  order: OrderWithAddressAndUser;
  orderIdsInRoute?: number[];
  index?: number;
  OrderDetails?: JSX.Element;
  markOrderInProcess?: (orderId: number) => any;
}

const QueuedOrder: React.FC<QueuedOrderProps> = (props) => {
  const { order, orderIdsInRoute, index, OrderDetails, markOrderInProcess } = props;

  const [disableInProcessButton, setDisableInProcessButton] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleMarkOrderAsInProcess = (orderId: number) => {
    markOrderInProcess(orderId);
  };

  return (
    <>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>
            <Text>
              {index ? `${index}. ` : null} {order.user.firstName} {order.user.lastName}{' '}
              {order.userFirstTimeOrderWithDSPR && '- FTP'}
            </Text>
            <Text>
              , ${order.cashTotal}{' '}
              {order.user.userNotes && order.user.userNotes.length > 0 ? (
                <Text> {/* - <NoteOutlined /> */}</Text>
              ) : (
                ''
              )}
            </Text>
          </ListItem.Title>
          <ListItem.Subtitle>
            {order.address.street} {order.address.zipCode}
          </ListItem.Subtitle>
        </ListItem.Content>
        {OrderDetails && (
          <Button mode="contained" onPress={() => setShowOrderDetails(true)}>
            Details
          </Button>
        )}
        {markOrderInProcess && (
          <Button
            mode="contained"
            disabled={disableInProcessButton}
            onPress={() => handleMarkOrderAsInProcess(order.id)}
          >
            Make In Process
          </Button>
        )}
      </ListItem>
      <Dialog visible={showOrderDetails} onDismiss={() => setShowOrderDetails(false)}>
        <Dialog.Title>Order Details</Dialog.Title>
        <Card>{showOrderDetails && OrderDetails}</Card>
      </Dialog>
    </>
  );
};

interface OrderRouteLegDirectionRowProps {
  routeLegDirection: RouteLegDirection & {
    metrics: RouteMetrics;
    htmlDirections: any;
  };
  index?: number;
}

const OrderRouteLegDirectionRow: React.FC<OrderRouteLegDirectionRowProps> = (props) => {
  const { routeLegDirection, index } = props;

  return (
    <>
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>
            {' '}
            <Text>
              {index ? index + '. ' : null}
              <Text dangerouslySetInnerHTML={{ __html: routeLegDirection.htmlDirections }}></Text>
            </Text>
            <Text> - {routeLegDirection.metrics.distanceText}</Text>
          </ListItem.Title>
          <ListItem.Subtitle>
            {order.address.street} {order.address.zipCode}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </>
  );
};

interface DriverRoutePageProps {
  driver: Omit<DsprDriver, 'user'> & {
    user: User;
    currentLocation?: DsprDriverLocation;
    queuedOrders?: OrderWithAddressAndUser[];
    currentInProcessOrder?: OrderWithAddressAndUser;
    currentRoute?: Omit<Route, 'legs'> & {
      legs: Omit<RouteLeg, 'order'> &
        {
          order: OrderWithAddressAndUser;
          routeLegDirections: Omit<RouteLegDirection, 'metrics'> &
            {
              metrics: RouteMetrics;
            }[];
          overviewPolyline: google.maps.LatLng[];
        }[];
    };
    serviceAreas?: DSPRDriverServiceArea[];
  };
  dspr: DSPR;
  completeOrder: (orderId: number) => any;
  createRoute: (
    driverId: number,
    waypoints: OrderWithAddressAndUser[],
    finalDestination: OrderWithAddressAndUser,
    usingFinalDestinationInRoute: Boolean
  ) => any;
  progressRoute: (routeId: number) => any;
  dsprDriverIdForOrderDetails: number;
  handleMapOrderClick: (order: any) => any;
}

const DriverRoutePage: React.FC<DriverRoutePageProps> = (props) => {
  const {
    driver,
    dspr,
    createRoute,
    completeOrder,
    progressRoute,
    dsprDriverIdForOrderDetails,
    handleMapOrderClick,
  } = props;

  //For creating new Route
  const [proposedOrderIdsInRoute, setProposedOrderIdsInRoute] = useState([]);
  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [numberOrdersPerRoute, setNumberOrdersPerRoute] = useState();
  const [ordersForRoute, setOrdersForRoute] = useState([]);
  const [finalOrderForRoute, setFinalOrderForRoute] = useState();
  const [useFinalOrderInRoute, setUseFinalOrderInRoute] = useState(false);

  const [ordersCurrentlyInRoute, setOrdersCurrentlyInRoute] = useState();
  const [currentInProcessOrderInActiveRoute, setCurrentInProcessOrderInActiveRoute] = useState();
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState();

  const [routeError, setRouteError] = useState();
  const [polylineForMap, setPolylineForMap] = useState(null);
  const [overviewPolyline, setOverviewPolyline] = useState(null);

  // const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showErrorModal, setShowErrorModal] = useState(false);
  // const [showWarningModal, setShowWarningModal] = useState(false);
  // const [modalPrimaryText, setModalPrimaryText] = useState(null);
  // const [modalSecondaryText, setModalSecondaryText] = useState(null);
  const [routeButtonDisabled, setRouteButtonDisabled] = useState(false);

  const handleOpenOrderSelectionModal = () => {
    setOrderSelectionModalOpen(true);
  };

  const handleCloseOrderSelectionModal = () => {
    setOrderSelectionModalOpen(false);
  };

  const handleRouteCreationSubmission = () => {
    let resetRoute: boolean = true;
    setRouteButtonDisabled(true);
    if (driver.currentRoute && driver.currentRoute.active) {
      Alert.alert(
        'Override Route?',
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => (resetRoute = true) },
        ]
      );
    }
    if (resetRoute) {
      if (ordersForRoute.length > 0) {
        if (!routeError) {
          createRoute(driver.id, ordersForRoute, finalOrderForRoute, useFinalOrderInRoute);
          setRouteButtonDisabled(false);
          handleCloseOrderSelectionModal();
        } else {
          setRouteButtonDisabled(false);
        }
      } else {
        setRouteError('A route must contain at least 1 order.');
        setRouteButtonDisabled(false);
      }
    } else {
      setRouteButtonDisabled(false);
    }
  };

  const handleRouteActionButtonPressed = () => {
    let currentRouteId = driver.currentRoute && driver.currentRoute.id;
    if (ordersCurrentlyInRoute) {
      if (driver.currentInProcessOrder) {
        if (
          !Object.keys(ordersCurrentlyInRoute).includes(driver.currentInProcessOrder.id.toString())
        ) {
          // The current in-process order is not an order in the route, so it shouldn't assume to be completed before the next order is started
          // Confirmation page asking whether the current order they are doing should be completed or not
          const completeInProcessOrder = window.confirm(
            'You currently have an in-process order that is not part of the route. Would you like to mark this order as complete and continue with your route?'
          );
          if (completeInProcessOrder) {
            completeOrder(driver.currentInProcessOrder.id).then((response) => {
              if (response.type === COMPLETE_ORDER_SUCCESS) {
                progressRoute(driver.currentRoute.id);
              }
            });
          } else {
            progressRoute(driver.currentRoute.id);
          }
        } else {
          completeOrder(driver.currentInProcessOrder.id);
        }
      } else {
        progressRoute(driver.currentRoute.id);
      }
    }
  };

  // set number orders per route
  useEffect(() => {
    if (
      driver &&
      driver.serviceAreas &&
      driver.serviceAreas[0] &&
      driver.serviceAreas[0].numberOrdersPerRoute
    ) {
      setNumberOrdersPerRoute(driver.serviceAreas[0].numberOrdersPerRoute);
    } else {
      setNumberOrdersPerRoute(dspr.numberOrdersPerRoute);
    }
  }, [dspr.numberOrdersPerRoute, driver.serviceAreas]);

  useEffect(() => {
    if (driver && driver.currentRoute && !driver.currentRoute.active) {
      setOverviewPolyline(undefined);
      setCurrentInProcessOrderInActiveRoute(false);
      setCurrentlyActiveRouteLegIndex(undefined);
      setPolylineForMap(undefined);
    } else {
      if (driver && driver.currentRoute && driver.currentRoute.overviewPolyline) {
        setOverviewPolyline(driver.currentRoute.overviewPolyline);
      }

      // create an object with the ids of orders in route
      const ordersInRoute = {};
      if (driver && driver.queuedOrders && driver.currentRoute && driver.currentRoute.legs) {
        driver.currentRoute.legs.forEach((leg: any) => {
          if (leg.order) ordersInRoute[leg.order.id] = leg.legOrder;
        });
        setOrdersCurrentlyInRoute(ordersInRoute);
      }

      // if there is an in-process order, set it to the active leg of the route
      if (
        driver &&
        ordersInRoute &&
        Object.keys(ordersInRoute).length > 0 &&
        driver.currentInProcessOrder
      ) {
        if (Object.keys(ordersInRoute).includes(driver.currentInProcessOrder.id.toString())) {
          setCurrentInProcessOrderInActiveRoute(true);
          setCurrentlyActiveRouteLegIndex(
            driver.currentRoute.legs.findIndex(
              (leg: any) => leg.legOrder === ordersInRoute[driver.currentInProcessOrder.id]
            )
          );
        } else {
          setCurrentInProcessOrderInActiveRoute(false);
          setCurrentlyActiveRouteLegIndex(undefined);
        }
      }
    }
  }, [driver]);

  useEffect(() => {
    if (
      currentlyActiveRouteLegIndex !== undefined &&
      driver.currentRoute &&
      driver.currentRoute.active &&
      driver.currentRoute.legs
    ) {
      const legPolyline = [];
      const legDirectionPolylines = driver.currentRoute.legs[
        currentlyActiveRouteLegIndex
      ].routeLegDirections.map((routeLegDirection: any) => routeLegDirection.overviewPolyline);
      const finishedArray = legPolyline.concat(...legDirectionPolylines);
      setPolylineForMap(finishedArray);
    } else {
      setPolylineForMap(null);
    }
  }, [currentlyActiveRouteLegIndex]);

  //Temporarily autofilling orders into route
  useEffect(() => {
    const orders = [];
    //if modal not open, then continue with this, however we need to skip the prefill when the modal is open
    if (numberOrdersPerRoute) {
      if (driver.currentInProcessOrder) orders.push(driver.currentInProcessOrder);
      if (driver.queuedOrders) {
        for (
          let i = 0;
          i < driver.queuedOrders.length && orders.length <= numberOrdersPerRoute;
          ++i
        ) {
          if (orders.length === numberOrdersPerRoute) {
            setFinalOrderForRoute(driver.queuedOrders[i]);
            setUseFinalOrderInRoute(false);
          } else {
            orders.push(driver.queuedOrders[i]);
          }
        }
      }
    }
    setOrdersForRoute(orders);
    setProposedOrderIdsInRoute(orders.map((order) => order.id));
  }, [driver, numberOrdersPerRoute]);

  return (
    <View style={{ flex: 1 }}>
      {driver && (!driver.currentRoute || (driver.currentRoute && !driver.currentRoute.active)) && (
        <Button
          mode="contained"
          labelStyle={{ color: Colors.light }}
          onPress={() => handleOpenOrderSelectionModal()}
        >
          Create New Route
        </Button>
      )}
      {driver.currentRoute && driver.currentRoute.active && (
        <View>
          {
            <GettingStartedGoogleMap
              driver={driver}
              orderPolyline={polylineForMap}
              overviewPolyline={overviewPolyline}
              currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
              handleMapOrderClick={handleMapOrderClick}
            />
          }
          <View>
            <Button
              mode="contained"
              labelStyle={{ color: Colors.light }}
              onPress={() => handleRouteActionButtonPressed()}
            >
              {!currentInProcessOrderInActiveRoute ? 'Begin Next Leg' : 'Complete Order'}
            </Button>
            {/* { TODO: Make a note here that any in-process orders should be completed before a route is started } */}
            <Button
              mode="contained"
              labelStyle={{ color: Colors.light }}
              onPress={() => handleOpenOrderSelectionModal()}
            >
              Create New Route
            </Button>
          </View>
          {/* {currentInProcessOrderInActiveRoute &&
            currentlyActiveRouteLegIndex !== undefined &&
            driver.currentInProcessOrder && (
              <List>
                <QueuedOrder
                  key={driver.currentInProcessOrder.id}
                  order={driver.currentInProcessOrder}
                  OrderDetails={
                    <OrderWithDetailsAndPrices
                      order={driver.currentInProcessOrder}
                      user={driver.currentInProcessOrder.user}
                      address={driver.currentInProcessOrder.address}
                      dsprDriverId={dsprDriverIdForOrderDetails}
                      modifyOrder={modifyOrder}
                    />
                  }
                />
              </List>
            )} */}

          {currentInProcessOrderInActiveRoute && currentlyActiveRouteLegIndex !== undefined && (
            <View>
              <Text>Directions: </Text>
              {driver.currentRoute.legs[currentlyActiveRouteLegIndex].routeLegDirections.map(
                (routeLegDirection: any, index) => (
                  <OrderRouteLegDirectionRow
                    key={routeLegDirection.id + '-' + index}
                    routeLegDirection={routeLegDirection}
                    index={++index}
                  />
                )
              )}
            </View>
          )}
          <View>
            <Text>Orders In Route:</Text>
            {/* <FlatList
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text>No orders.</Text>
                </View>
              }
              data={driver.currentRoute.legs}
              renderItem={(item) => <OrderItem orderInfo={item.item} navigation={navigation} />}
              keyExtractor={(item: any) => item.id.toString()}
              style={styles.orders}
            /> */}
            {/* <List>
              {driver.currentRoute.legs.map(
                (leg, index) =>
                  leg.order && (
                    <QueuedOrder
                      key={leg.order.id}
                      order={leg.order}
                      OrderDetails={
                        <OrderWithDetailsAndPrices
                          order={leg.order}
                          user={leg.order.user}
                          address={leg.order.address}
                          dsprDriverId={dsprDriverIdForOrderDetails}
                          modifyOrder={modifyOrder}
                        />
                      }
                      index={++index}
                    />
                  )
              )}
            </List> */}
          </View>
        </View>
      )}

      <Dialog visible={orderSelectionModalOpen} onDismiss={() => handleCloseOrderSelectionModal()}>
        <Dialog.Title>Order Selection</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.listTitle}>
            Selected Orders: {ordersForRoute.length || 0}/{numberOrdersPerRoute}
          </Text>
          <Divider />
          {driver && driver.currentInProcessOrder && (
            <>
              <Text style={styles.listTitle}>In Process Order</Text>
              <Divider />
              <OrderItemBasic orderInfo={driver.currentInProcessOrder} />
            </>
          )}
          {driver && driver.queuedOrders && driver.queuedOrders.length > 0 && (
            <>
              <Text style={styles.listTitle}>Queued Orders</Text>
              <Divider />
              <FlatList
                ListEmptyComponent={
                  <View style={styles.empty}>
                    <Text>No orders.</Text>
                  </View>
                }
                data={driver.queuedOrders}
                renderItem={(item) => <OrderItemBasic orderInfo={item.item} />}
                keyExtractor={(item: any) => item.id.toString()}
                style={styles.orders}
              />
            </>
          )}
          {routeError && <p>{routeError}</p>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={() => handleCloseOrderSelectionModal()}>
            Cancel
          </Button>
          <Button
            mode="contained"
            labelStyle={{ color: Colors.light }}
            disabled={routeButtonDisabled}
            onPress={() => handleRouteCreationSubmission()}
          >
            Create Route
          </Button>
        </Dialog.Actions>
      </Dialog>
      {/* {showSuccessModal && (
        <SweetAlert
          success
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={modalPrimaryText}
          onConfirm={() => setShowSuccessModal(false)}
          showConfirm={false}
        >
          {modalSecondaryText}
        </SweetAlert>
      )}
      {showErrorModal && (
        <SweetAlert
          error
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={modalPrimaryText}
          onConfirm={() => setShowErrorModal(false)}
          showConfirm={false}
        >
          {modalSecondaryText}
        </SweetAlert>
      )}
      {showWarningModal && (
        <SweetAlert
          warning
          timeout={2000}
          style={{ display: 'block', position: 'fixed', maxWidth: 'calc(100% - 40px)' }}
          title={'Route Changed'}
          onConfirm={() => setShowWarningModal(false)}
          showConfirm={false}
        >
          {'Due to some order changes, your route has been modified'}
        </SweetAlert>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  orders: {
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
});

export default DriverRoutePage;
