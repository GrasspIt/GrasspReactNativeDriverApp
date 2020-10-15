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

  const [onOverview, setOnOverview] = useState(true);

  useEffect(() => {
    if (orderPolyline || currentlyActiveRouteLegIndex) {
      setOnOverview(false);
    } else {
      setOnOverview(true);
    }
  }, [orderPolyline, currentlyActiveRouteLegIndex]);

  const name = driver && driver.user && driver.user.firstName + ' ' + driver.user.lastName;

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
          if (!orderForLeg || !orderForLeg.address) return null;
          return (
            <Marker
              coordinate={{
                latitude: orderForLeg.address.latitude,
                longitude: orderForLeg.address.longitude,
              }}
              {...orderForLeg}
              pinColor='red'
              onPress={() => handleMapOrderClick(orderForLeg)}
              key={orderForLeg.address.id}
            />
          );
        }
      )
      .filter((marker) => marker != null);

  // change polyline keys from lat/lng into latitude/longitude
  let orderPolylineCoordinates =
    orderPolyline &&
    orderPolyline.map((coordinate) => {
      return {
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      };
    });

  let overviewPolylineCoordinates =
    overviewPolyline &&
    overviewPolyline.map((coordinate) => {
      return {
        latitude: coordinate.lat,
        longitude: coordinate.lng,
      };
    });

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
  };

  // find center of route based on current route or based on the driver's current location
  const routeCenter =
    driver && driver.currentRoute
      ? findOverviewPolylineCenter()
      : driver && driver.currentLocation
      ? { lat: driver.currentLocation.latitude, lng: driver.currentLocation.longitude }
      : null;

  const polylineCenter = driver && orderPolyline && findOrderPolylineCenter();

  return (
    <>
      {polylineCenter && (
        <MapView
          style={{ flex: 1 }}
          region={
            polylineCenter && routeCenter && onOverview
              ? {
                  latitude: routeCenter.lat,
                  longitude: routeCenter.lng,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                }
              : {
                  latitude: polylineCenter.lat,
                  longitude: polylineCenter.lng,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                }
          }
        >
          {driver && driver.currentLocation && (
            <Marker
              onPress={toggleCallout}
              pinColor='green'
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
          )}
          {!onOverview ? (
            <Polyline
              coordinates={orderPolylineCoordinates}
              geodesic={true}
              strokeColor='#03adfc'
              strokeWidth={5}
            />
          ) : (
            <Polyline
              coordinates={overviewPolylineCoordinates}
              geodesic={true}
              strokeColor='#03adfc'
              strokeWidth={5}
            />
          )}
          {orderMarkers && orderMarkers.length > 0 && orderMarkers}
        </MapView>
      )}
    </>
  );
};

export default GettingStartedMap;
