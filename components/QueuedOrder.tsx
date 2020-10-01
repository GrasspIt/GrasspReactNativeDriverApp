import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Dialog, Card } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import { OrderWithAddressAndUser } from '../store/reduxStoreState';

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
            onPress={() => markOrderInProcess(order.id)}
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

export default QueuedOrder;
