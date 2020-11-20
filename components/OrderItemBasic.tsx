import React from 'react';
import { Divider, List } from 'react-native-paper';

const OrderItemBasic = ({ orderInfo }) => {
  return (
    orderInfo && (
      <>
        <List.Item
          title={`${orderInfo.user.firstName} ${orderInfo.user.lastName}, $${orderInfo.cashTotal}`}
          description={`${orderInfo.address.street} ${orderInfo.address.zipCode}`}
          titleNumberOfLines={2}
          descriptionNumberOfLines={2}
        />
        <Divider />
      </>
    )
  );
};

export default OrderItemBasic;
