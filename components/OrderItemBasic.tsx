import React, { useState, useEffect } from 'react';
import { Checkbox, Divider, List } from 'react-native-paper';

const OrderItemBasic = ({ orderInfo, handleSelectOrder, selectedOrdersForRoute }) => {
  const [checked, setChecked] = useState(false);

  const description =
    orderInfo && orderInfo.address && orderInfo.address && orderInfo.address.aptNumber
      ? `${orderInfo.address.street}, ${orderInfo.address.zipCode}, Unit ${orderInfo.address.aptNumber}`
      : `${orderInfo.address.street}, ${orderInfo.address.zipCode}`;

  useEffect(() => {
    selectedOrdersForRoute.includes(orderInfo) ? setChecked(true) : setChecked(false);
  }, [selectedOrdersForRoute, orderInfo]);

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
          onPress={() => handleSelectOrder(orderInfo)}
          left={() => <Checkbox status={checked ? 'checked' : 'unchecked'} />}
        />
        <Divider />
      </>
    )
  );
};

export default OrderItemBasic;
