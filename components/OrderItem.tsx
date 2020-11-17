import React from 'react';
import { Text, Alert, View, StyleSheet } from 'react-native';
// import { ListItem, Button } from 'react-native-elements';
import { useTheme, Button, Card, IconButton, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { markOrderInProcess, cancelOrder } from '../actions/orderActions';

const OrderItem = ({ orderInfo, navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleProcessOrder = () => {
    Alert.alert('Process Order', 'Are you sure you want to set this order in-process?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(markOrderInProcess(orderInfo.id)) },
    ]);
  };

  const handleCancelOrder = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => dispatch(cancelOrder(orderInfo.id)) },
    ]);
  };

  return (
    orderInfo && (
      <Card
        style={{ marginBottom: 10 }}
        onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      >
        <Card.Content
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, paddingBottom: 4 }}>
                {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 4 }}>${orderInfo.cashTotal}</Text>
            </View>
            <Text style={{ fontSize: 16, paddingBottom: 8 }}>
              {orderInfo.address.street} {orderInfo.address.zipCode}{' '}
              {orderInfo.address.aptNumber && `, Unit ${orderInfo.address.aptNumber}`}
            </Text>
          </View>
          <IconButton
            icon='chevron-right'
            onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
          />
        </Card.Content>
        <Divider />
        <Card.Actions style={{ padding: 0 }}>
          <Button
            icon='cancel'
            mode='contained'
            color={colors.error}
            style={styles.buttons}
            labelStyle={{ color: colors.surface }}
            onPress={handleCancelOrder}
          >
            Cancel Order
          </Button>
          <Button
            mode='contained'
            icon='autorenew'
            color={colors.primary}
            style={styles.buttons}
            labelStyle={{ color: colors.surface }}
            onPress={handleProcessOrder}
          >
            Set In Process
          </Button>
        </Card.Actions>
      </Card>
      // <ListItem
      //   bottomDivider
      //   containerStyle={{ padding: 2 }}
      //   onPress={() => navigation.navigate('Details', { orderId: orderInfo.id })}
      // >
      //   <Button
      //     title='Set In Process'
      //     titleStyle={{ fontSize: 14 }}
      //     buttonStyle={{
      //       width: 80,
      //       height: 60,
      //       borderRadius: 0,
      //       backgroundColor: colors.primary,
      //     }}
      //     containerStyle={{ borderRadius: 0 }}
      //     onPress={handleProcessOrder}
      //   />
      //   <ListItem.Content>
      //     <ListItem.Title style={{ fontSize: 16 }}>
      //       {orderInfo.user.firstName} {orderInfo.user.lastName},{' '}
      //       <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
      //     </ListItem.Title>
      //     <ListItem.Subtitle style={{ fontSize: 14 }}>
      //       {orderInfo.address.street} {orderInfo.address.zipCode}{' '}
      //       {orderInfo.address.aptNumber && `, Unit ${orderInfo.address.aptNumber}`}
      //     </ListItem.Subtitle>
      //   </ListItem.Content>
      //   <ListItem.Chevron color={colors.onBackground} size={18} />
      // </ListItem>
    )
  );
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    // marginHorizontal: 6,
    // marginBottom: 6,
    elevation: 0,
    margin: 2,
    // width: '50%',
    // alignSelf: 'flex-end',
  },
});

export default OrderItem;
