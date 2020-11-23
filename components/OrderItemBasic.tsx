import React from 'react';
import { Checkbox, Divider, List } from 'react-native-paper';

const OrderItemBasic = ({ orderInfo, handleSelectOrder, selectedOrdersForRoute }) => {
  const description =
    orderInfo && orderInfo.address && orderInfo.address && orderInfo.address.aptNumber
      ? `${orderInfo.address.street}, ${orderInfo.address.zipCode}, Unit ${orderInfo.address.aptNumber}`
      : `${orderInfo.address.street}, ${orderInfo.address.zipCode}`;

  return (
    orderInfo &&
    orderInfo.address &&
    orderInfo.user &&
    orderInfo.cashTotal && (
      <>
        <List.Item
          title={`${orderInfo.user.firstName} ${orderInfo.user.lastName}, $${orderInfo.cashTotal}`}
          description={description}
          descriptionNumberOfLines={2}
          titleNumberOfLines={2}
          onPress={() => handleSelectOrder(orderInfo.id)}
          left={() => (
            <Checkbox
              status={selectedOrdersForRoute.includes(orderInfo) ? 'checked' : 'unchecked'}
            />
          )}
        />
        <Divider />
      </>
    )
  );
};

export default OrderItemBasic;
