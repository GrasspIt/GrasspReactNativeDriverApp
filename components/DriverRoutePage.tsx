import React, { useState, Fragment, useEffect } from 'react';
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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemText,
  List,
  DialogActions,
  Card,
} from 'react-native-paper';
import { GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { NoteOutlined } from '@material-ui/icons';
import { COMPLETE_ORDER_SUCCESS, MARK_IN_PROCESS_FAILURE } from '../actions/orderActions';
import OrderWithDetailsAndPrices from '../containers/OrderWithDetailsAndPrices';
import {
  CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS,
  PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS,
} from '../actions/driverActions';
import SweetAlert from 'react-bootstrap-sweetalert';

export const markerColors = {
  yellow: { url: '/assets/images/yellow_marker.svg', labelOrigin: { x: 14, y: 15 } },
  orange: { url: '/assets/images/orange_marker.svg', labelOrigin: { x: 14, y: 15 } },
  red: { url: '/assets/images/red_marker.svg', labelOrigin: { x: 14, y: 15 } },
  blue: { url: '/assets/images/blue_marker.svg', labelOrigin: { x: 14, y: 15 } },
  green: { url: '/assets/images/green_marker.svg', labelOrigin: { x: 14, y: 15 } },
};

interface GettingStartedGoogleMapProps {
  driver: any;
  icons: any;
  orderPolyline: any;
  overviewPolyline: google.maps.LatLng[];
  currentlyActiveRouteLegIndex: number;
  toggleInfoWindow?: any;
  handleMapOrderClick?: (order: any) => any;
  showInfoWindow?: () => any;
}

const GettingStartedGoogleMap: React.FC<GettingStartedGoogleMapProps> = (props) => {
  const {
    driver,
    icons,
    orderPolyline,
    overviewPolyline,
    currentlyActiveRouteLegIndex,
    toggleInfoWindow,
    handleMapOrderClick,
    showInfoWindow,
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

  const driverMarker = driver && driver.currentLocation && (
    <Marker
      onClick={toggleInfoWindow}
      icon={icons['green']}
      label={initials}
      position={{ lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }}
    >
      {showInfoWindow && (
        <InfoWindow
          onCloseClick={toggleInfoWindow}
          position={{ lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }}
          options={{ pixelOffset: new google.maps.Size(0, -42) }} // this positions the info window on the top of the marker, not covering it
        >
          <p>
            {name}
            <br />
            Outstanding Orders:{' '}
            {driver.currentInProcessOrder
              ? driver.queuedOrders.length + 1
              : driver.queuedOrders.length}
          </p>
        </InfoWindow>
      )}
    </Marker>
  );

  const markers =
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
              position={{ lat: orderForLeg.address.latitude, lng: orderForLeg.address.longitude }}
              {...orderForLeg}
              icon={icons['red']}
              label={userInitials || (++index).toString()}
              onClick={() => handleOrderClick(orderForLeg)}
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
    <GoogleMap
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
      {markers && markers.length > 0 ? markers : undefined}
    </GoogleMap>
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
    setDisableInProcessButton(true);
    markOrderInProcess(orderId).then((response) => {
      if (response.type === MARK_IN_PROCESS_FAILURE) setDisableInProcessButton(false);
    });
  };

  return (
    <Fragment>
      <ListItem
        className={orderIdsInRoute && orderIdsInRoute.includes(order.id) ? 'order-in-route' : ''}
      >
        <ListItemText
          primary={
            <Fragment>
              <span>
                {index ? `${index}. ` : null} {order.user.firstName} {order.user.lastName}{' '}
                {order.userFirstTimeOrderWithDSPR && '- FTP'}
              </span>
              <span className="queued-order-total">
                , ${order.cashTotal}{' '}
                {order.user.userNotes && order.user.userNotes.length > 0 ? (
                  <span>
                    {' '}
                    - <NoteOutlined className="note-Icon" />
                  </span>
                ) : (
                  ''
                )}
              </span>
            </Fragment>
          }
          secondary={`${order.address.street} ${order.address.zipCode}`}
        />
        {OrderDetails && (
          <Button variant="contained" color="primary" onClick={() => setShowOrderDetails(true)}>
            Details
          </Button>
        )}
        {markOrderInProcess && (
          <Button
            variant="contained"
            color="primary"
            disabled={disableInProcessButton}
            onClick={() => handleMarkOrderAsInProcess(order.id)}
          >
            Make In Process
          </Button>
        )}
      </ListItem>
      <Dialog
        title="Order Details"
        open={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
      >
        <Card className="driver-page-order-detail-popup-card">
          {showOrderDetails && OrderDetails}
        </Card>
      </Dialog>
    </Fragment>
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
    <Fragment>
      <ListItem>
        <ListItemText
          primary={
            <Fragment>
              <span>
                {index ? index + '. ' : null}
                <span dangerouslySetInnerHTML={{ __html: routeLegDirection.htmlDirections }}></span>
              </span>
              <span className="queued-order-total">
                {' '}
                - {routeLegDirection.metrics.distanceText}
              </span>
            </Fragment>
          }
          //secondary={`${order.address.street} ${order.address.zipCode}`}
        />
      </ListItem>
    </Fragment>
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
  modifyOrder: any;
  loggedInUserIsDriver: boolean;
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
    modifyOrder,
    dsprDriverIdForOrderDetails,
    handleMapOrderClick,
  } = props;

  //For creating new Route
  const [proposedOrderIdsInRoute, setProposedOrderIdsInRoute] = useState([]);
  const [orderSelectionModalOpen, setOrderSelectionModalOpen] = useState(false);
  const [numberOrdersPerRoute, setNumberOrdersPerRoute] = useState(undefined);
  const [ordersForRoute, setOrdersForRoute] = useState([]);
  const [finalOrderForRoute, setFinalOrderForRoute] = useState(undefined);
  const [useFinalOrderInRoute, setUseFinalOrderInRoute] = useState(false);

  const [ordersCurrentlyInRoute, setOrdersCurrentlyInRoute] = useState(undefined);
  const [currentInProcessOrderInActiveRoute, setCurrentInProcessOrderInActiveRoute] = useState(
    undefined
  );
  const [currentlyActiveRouteLegIndex, setCurrentlyActiveRouteLegIndex] = useState(undefined);

  const [routeError, setRouteError] = useState(undefined);
  const [polylineForMap, setPolylineForMap] = useState(null);
  const [overviewPolyline, setOverviewPolyline] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [modalPrimaryText, setModalPrimaryText] = useState(null);
  const [modalSecondaryText, setModalSecondaryText] = useState(null);
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
      resetRoute = window.confirm(
        'The driver is currently in the middle of a route. Are you sure you want to override their current route?'
      );
    }

    if (resetRoute) {
      if (ordersForRoute.length !== 0) {
        if (!routeError) {
          createRoute(driver.id, ordersForRoute, finalOrderForRoute, useFinalOrderInRoute).then(
            (response) => {
              setRouteButtonDisabled(false);
              if (response.type === CREATE_NEW_DSPR_DRIVER_ROUTE_SUCCESS) {
                setModalPrimaryText('Route Created');
                setFinalOrderForRoute(undefined);
                setUseFinalOrderInRoute(false);
                setModalSecondaryText('Your route has been created!');
                setShowSuccessModal(true);
              } else {
                setModalPrimaryText('Error Creating Route!');
                setModalSecondaryText(response.error || 'No error message provided');
                setShowErrorModal(true);
              }
              handleCloseOrderSelectionModal();
            }
          );
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
                progressRoute(driver.currentRoute.id).then((response) => {
                  if (response.type === PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS) {
                    if (response.response.result !== currentRouteId) {
                      setShowWarningModal(true);
                    }
                  }
                });
              }
            });
          } else {
            progressRoute(driver.currentRoute.id).then((response) => {
              if (response.type === PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS) {
                if (response.response.result !== currentRouteId) {
                  setShowWarningModal(true);
                }
              }
            });
          }
        } else {
          completeOrder(driver.currentInProcessOrder.id);
        }
      } else {
        progressRoute(driver.currentRoute.id).then((response) => {
          if (response.type === PROGRESS_DSPR_DRIVER_ROUTE_SUCCESS) {
            if (response.response.result !== currentRouteId) {
              setShowWarningModal(true);
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    if (
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

      const ordersInRoute = {};
      if (driver && driver.queuedOrders && driver.currentRoute && driver.currentRoute.legs) {
        driver.currentRoute.legs.forEach((leg: any) => {
          if (leg.order) ordersInRoute[leg.order.id] = leg.legOrder;
        });
        setOrdersCurrentlyInRoute(ordersInRoute);
      }

      if (driver && Object.keys(ordersInRoute).length > 0) {
        if (driver.currentInProcessOrder && ordersInRoute) {
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
    // eslint-disable-next-line
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
  }, [driver, numberOrdersPerRoute]);

  useEffect(() => {
    setProposedOrderIdsInRoute(ordersForRoute.map((order) => order.id));
  }, [ordersForRoute]);

  return (
    <div className="driver-route-page">
      {driver && (!driver.currentRoute || (driver.currentRoute && !driver.currentRoute.active)) && (
        <Button color="primary" variant="contained" onClick={() => handleOpenOrderSelectionModal()}>
          Create New Route
        </Button>
      )}
      {driver.currentRoute && driver.currentRoute.active && (
        <div>
          {
            <GettingStartedGoogleMap
              driver={driver}
              icons={markerColors}
              orderPolyline={polylineForMap}
              overviewPolyline={overviewPolyline}
              currentlyActiveRouteLegIndex={currentlyActiveRouteLegIndex}
              handleMapOrderClick={handleMapOrderClick}
            />
          }
          <div className="buttons-container">
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleRouteActionButtonPressed()}
            >
              {!currentInProcessOrderInActiveRoute ? 'Begin Next Leg' : 'Complete Order'}
            </Button>
            {/* { TODO: Make a note here that any in-process orders should be completed before a route is started } */}
            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleOpenOrderSelectionModal()}
            >
              Create New Route
            </Button>
          </div>
          {currentInProcessOrderInActiveRoute &&
            currentlyActiveRouteLegIndex !== undefined &&
            driver.currentInProcessOrder && (
              <List className="queued-driver-route-page-orders-list">
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
            )}

          {currentInProcessOrderInActiveRoute && currentlyActiveRouteLegIndex !== undefined && (
            <div>
              <h4>Directions: </h4>
              {driver.currentRoute.legs[currentlyActiveRouteLegIndex].routeLegDirections.map(
                (routeLegDirection: any, index) => (
                  <OrderRouteLegDirectionRow
                    key={routeLegDirection.id + '-' + index}
                    routeLegDirection={routeLegDirection}
                    index={++index}
                  />
                )
              )}
            </div>
          )}
          <div>
            <h4>Orders In Route:</h4>
            <List className="queued-driver-route-page-orders-list">
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
            </List>
          </div>
        </div>
      )}

      <Dialog
        open={orderSelectionModalOpen}
        onClose={() => handleCloseOrderSelectionModal()}
        className="new-route-dialog"
      >
        <DialogTitle>Order Selection</DialogTitle>
        <DialogContent>
          <p>
            Selected Orders: <strong>{ordersForRoute.length || 0}</strong>/
            <strong>{numberOrdersPerRoute}</strong>
          </p>
          {driver && driver.currentInProcessOrder && (
            <Fragment>
              <h5>In Process Order</h5>
              <List className="queued-driver-route-page-orders-selection-list">
                <QueuedOrder
                  key={driver.currentInProcessOrder.id}
                  order={driver.currentInProcessOrder as OrderWithAddressAndUser}
                  orderIdsInRoute={proposedOrderIdsInRoute}
                />
              </List>
            </Fragment>
          )}
          {driver && driver.queuedOrders && driver.queuedOrders.length > 0 && (
            <Fragment>
              <h5>Queued Orders</h5>
              <List className="queued-driver-route-page-orders-selection-list">
                {(driver.queuedOrders as OrderWithAddressAndUser[]).map((order) => (
                  <QueuedOrder
                    key={order.id}
                    order={order}
                    orderIdsInRoute={proposedOrderIdsInRoute}
                  />
                ))}
              </List>
            </Fragment>
          )}
          {routeError && <p className="error">{routeError}</p>}
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="primary" onClick={() => handleCloseOrderSelectionModal()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={routeButtonDisabled}
            onClick={() => handleRouteCreationSubmission()}
          >
            Create Route
          </Button>
        </DialogActions>
      </Dialog>
      {showSuccessModal && (
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
      )}
    </div>
  );
};

export default DriverRoutePage;
