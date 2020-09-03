import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { State, Order, Address, User } from '../store/reduxStoreState';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { markOrderInProcess, MARK_IN_PROCESS_FAILURE } from '../actions/orderActions';
import * as RootNavigation from '../navigation/RootNavigation';

type OrderProps = { orderInfo: Order };

const OrderItem = ({ orderInfo }: OrderProps) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const address = useSelector<State, Address>(
    (state) => state.api.entities.addresses[orderInfo.address]
  );
  const user = useSelector<State, User>((state) => state.api.entities.users[orderInfo.user]);

  const handleProcessOrder = () => {
    setIsLoading(true);
    dispatch<any>(markOrderInProcess(orderInfo.id)).then((response) => {
      if (response.type === MARK_IN_PROCESS_FAILURE) {
        setError(response.error);
        Alert.alert('Failed to set order in process. Try again.');
      }
      setIsLoading(false);
    });
  };

  return (
    <View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <View style={styles.itemContainer}>
            <View>
              <ListItem.Title>
                {user.firstName} {user.lastName},{' '}
                <Text style={{ fontSize: 14 }}>${orderInfo.cashTotal}</Text>
              </ListItem.Title>
              <ListItem.Subtitle>
                {address.street} {address.zipCode}
              </ListItem.Subtitle>
            </View>
            <View style={styles.buttonContainer}>
              <Icon
                name="info-with-circle"
                type="entypo"
                color={Colors.primary}
                size={28}
                containerStyle={{ marginHorizontal: 20 }}
                onPress={() => RootNavigation.navigate('Details', { orderInfo, user, address })}
              />
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Icon
                  disabled={orderInfo.orderStatus == 'in_process'}
                  disabledStyle={{ backgroundColor: Colors.light }}
                  name="gear"
                  type="font-awesome"
                  size={30}
                  color={orderInfo.orderStatus == 'in_process' ? Colors.medium : Colors.primary}
                  onPress={handleProcessOrder}
                />
              )}
            </View>
          </View>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default OrderItem;
