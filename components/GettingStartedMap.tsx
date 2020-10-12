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
  let orderPolylineCoordinates = orderPolyline.map(coordinate => {
    return {
      latitude: coordinate.lat,
      longitude: coordinate.lng
    }
  })

  let overviewPolylineCoordinates = overviewPolyline.map(coordinate => {
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
      console.log('orderPolyline', orderPolyline)
      console.log('overviewPolyline', overviewPolyline)
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
    let zoom = (currentMap && currentMap.getZoom()) || 20;
    if (currentMap && currentMap.getBounds() && containingCoords && latLngCoords) {
      const bounds = currentMap.getBounds();
      if (!(bounds.contains(latLngCoords[0]) && bounds.contains(latLngCoords[1]))) {
        --zoom;
        setMapZoomCalibrationStarted(true);
        currentMap && currentMap.setZoom(zoom);
      } else {
        setMapZoomCalibrationCompleted(true);
      }
    }
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
      ? findCenterPoint()
      : driver && driver.currentLocation
      ? { lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }
      : null;
  const polyLineCenter = driver && orderPolyline && findPolylineCenter();

  return (
    <MapView
    style={{flex: 1}}
      region={{
        latitude: polyLineCenter?.lat,
        longitude: polyLineCenter?.lng,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
    >
      {driverMarker}
      {mapOrderPolyline && !onOverview ? mapOrderPolyline : mapOverviewPolyline}
      {orderMarkers && orderMarkers.length > 0 ? orderMarkers : undefined}
    </MapView>
  );
};

export default GettingStartedMap;
