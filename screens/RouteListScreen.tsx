import React from 'react';
import { View, Text, Alert, StyleSheet, FlatList } from 'react-native';
import { Button, Dialog, Card } from 'react-native-paper';
import { ListItem, Divider } from 'react-native-elements';

const RouteListScreen = () => {
  return (
    <>
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

      {/* {currentInProcessOrderInActiveRoute && currentlyActiveRouteLegIndex !== undefined && (
            <View>
              <Text>Directions: </Text>
              {driver.currentRoute.legs[currentlyActiveRouteLegIndex].routeLegDirections.map(
                (routeLegDirection: any, index) => (
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
                )
              )}
            </View>
          )} */}
      {/* <View>
            <Text>Orders In Route:</Text>
            <FlatList
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text>No orders.</Text>
                </View>
              }
              data={driver.currentRoute.legs}
              renderItem={(item) => <OrderItemBasic orderInfo={item.item} />}
              keyExtractor={(item: any) => item.id.toString()}
              style={styles.orders}
            />
          </View> */}
    </>
  );
};

export default RouteListScreen;
