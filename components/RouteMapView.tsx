import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { OrderWithAddressAndUser, RouteLeg } from '../store/reduxStoreState';

interface RouteMapViewProps {
  navigation;
  driver: any;
  orderPolyline: any;
  overviewPolyline: any;
  currentlyActiveRouteLegIndex: number;
}

const RouteMapView: React.FC<RouteMapViewProps> = ({
  navigation,
  driver,
  orderPolyline,
  overviewPolyline,
  currentlyActiveRouteLegIndex,
}) => {
  const [onOverview, setOnOverview] = useState(true);
  const [routeCenter, setRouteCenter] = useState<any>();
  const [polylineCenter, setPolylineCenter] = useState<any>();

    console.log('(in RouteMapView) onOverView:', onOverview, 'routeCenter:', routeCenter, 'polylineCenter:', polylineCenter);

  const findOverviewPolylineCenter = () => {
    if (driver && driver.currentRoute.polylineContainingCoordinates) {
      const containingCoords = driver.currentRoute.polylineContainingCoordinates;
      const centerLat =
        containingCoords[1].latitude +
        (containingCoords[0].latitude - containingCoords[1].latitude) / 2;
      const centerLong =
        containingCoords[1].longitude +
        (containingCoords[0].longitude - containingCoords[1].longitude) / 2;
      setRouteCenter({ lat: centerLat, lng: centerLong });
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
      setPolylineCenter({ lat: centerLat, lng: centerLong });
    }
  };

  useEffect(() => {
    if (orderPolyline || currentlyActiveRouteLegIndex) {
      setOnOverview(false);
    } else {
      setOnOverview(true);
    }
    // find center of route based on current route or based on the driver's current location
    if (driver && driver.currentRoute) {
      findOverviewPolylineCenter();
    } else if (driver && driver.currentLocation) {
      setRouteCenter({
        lat: driver.currentLocation.latitude,
        lng: driver.currentLocation.longitude,
      });
    } else {
      setRouteCenter(null);
    }
    if (driver && orderPolyline) findOrderPolylineCenter();
  }, [driver, orderPolyline, currentlyActiveRouteLegIndex]);

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
          }
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
              key={orderForLeg.address.id}
            >
              <Callout onPress={() => navigation.navigate('Details', { orderId: orderForLeg.id })}>
                <Text>{orderForLeg.user.firstName + ' ' + orderForLeg.user.lastName}</Text>
                <Text style={{ color: '#2089dc' }}>Order Details</Text>
              </Callout>
            </Marker>
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

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        //style={{ flex: 1 }}
        style={styles.map}
        initialRegion={
          routeCenter && onOverview
            ? {
                latitude: routeCenter.lat,
                longitude: routeCenter.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            : polylineCenter && {
                latitude: polylineCenter.lat,
                longitude: polylineCenter.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
      >
        {driver && driver.currentLocation && (
          <Marker
            pinColor='green'
            coordinate={{
              latitude: driver.currentLocation.latitude,
              longitude: driver.currentLocation.longitude,
            }}
          >
            <Callout>
              <Text>{name}</Text>
              <Text>
                Outstanding Orders:{' '}
                {driver && driver.currentInProcessOrder
                  ? driver.queuedOrders.length + 1
                  : driver.queuedOrders.length}
              </Text>
            </Callout>
          </Marker>
        )}
        {!onOverview ? (
          <Polyline
            coordinates={orderPolylineCoordinates}
            geodesic={true}
            strokeColor='#03adfc'
            strokeWidth={5}
            lineDashPattern={[0]}
          />
        ) : (
          <Polyline
            coordinates={overviewPolylineCoordinates}
            geodesic={true}
            strokeColor='#03adfc'
            strokeWidth={5}
            lineDashPattern={[0]}
          />
        )}
        {orderMarkers && orderMarkers.length > 0 && orderMarkers}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default RouteMapView;
