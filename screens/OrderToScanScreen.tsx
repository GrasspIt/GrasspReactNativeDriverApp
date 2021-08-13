import React from 'react';

import OrderToScan from '../components/OrderToScan';

const OrderToScanScreen = ({
    navigation,
    route
}) => {
    const { orderId } = route.params;

    return <OrderToScan orderId={orderId}/>
}

export default OrderToScanScreen;