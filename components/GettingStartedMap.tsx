import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { OrderWithAddressAndUser, RouteLeg } from '../store/reduxStoreState';

interface GettingStartedMapProps {
  driver: any;
  orderPolyline: any;
  overviewPolyline: any;
  currentlyActiveRouteLegIndex: number;
  toggleCallout?: any;
  handleMapOrderClick: (order: any) => any;
  showCallout?: () => any;
}

const GettingStartedMap: React.FC<GettingStartedMapProps> = (props) => {
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
  const [currentMap, setCurrentMap] = useState<any>();

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
              onPress={() => handleMapOrderClick(orderForLeg)}
              key={orderForLeg.address.id}
            />
          );
        }
      )
      .filter((marker) => marker != null);

  // change polyline keys from lat/lng into latitude/longitude
  let orderPolylineCoordinates = orderPolyline && orderPolyline.map(coordinate => {
    return {
      latitude: coordinate.lat,
      longitude: coordinate.lng
    }
  })

  let overviewPolylineCoordinates = overviewPolyline && overviewPolyline.map(coordinate => {
    return {
      latitude: coordinate.lat,
      longitude: coordinate.lng
    }
  })

  const mapOrderPolyline = orderPolyline && (
    <Polyline coordinates={orderPolylineCoordinates} geodesic={true} strokeColor="#03adfc" strokeWidth={5} />
  );

  const mapOverviewPolyline = overviewPolyline && (
    <Polyline
      coordinates={overviewPolylineCoordinates}
      geodesic={true}
      strokeColor="#03adfc"
      strokeWidth={5}
    />
  );

  const findOverviewPolylineCenter = () => {
    if (driver && driver.currentRoute.polylineContainingCoordinates) {
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

  const findOrderPolylineCenter = () => {
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

  const toggleOnOverview = (setValue: boolean) => {
    setOnOverview(setValue);
    setMapZoomCalibrationStarted(false);
    setMapZoomCalibrationCompleted(false);
    currentMap && currentMap.setZoom(20);
  };

  useEffect(() => {
    if (orderPolyline) {
      toggleOnOverview(false);
    } else {
      toggleOnOverview(true);
    }
  }, [orderPolyline]);

  useEffect(() => {
    if (currentlyActiveRouteLegIndex) {
      toggleOnOverview(false);
    }
  }, [currentlyActiveRouteLegIndex]);

  // Use Longitude and Latitude of DSPR to set the location of the map if the driver's location isn't known
  const routeCenter =
    driver && driver.currentRoute
      ? findOverviewPolylineCenter()
      : driver && driver.currentLocation
      ? { lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }
      : null;

  const polyLineCenter = driver && orderPolyline && findOrderPolylineCenter();

  const initialLat = polyLineCenter && onOverview ? routeCenter.lat : polyLineCenter.lat;
  const initialLng = polyLineCenter && onOverview ? routeCenter.lng : polyLineCenter.lng;

  return (
    <>
    {polyLineCenter && (
      <MapView
      style={{flex: 1}}
        region={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        {driverMarker}
        {mapOrderPolyline && !onOverview ? mapOrderPolyline : mapOverviewPolyline}
        {orderMarkers && orderMarkers.length > 0 && orderMarkers}
      </MapView>

    )}
    </>
  );
};

export default GettingStartedMap;
