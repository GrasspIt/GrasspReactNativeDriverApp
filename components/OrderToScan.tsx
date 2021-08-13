import React from 'react';
import { SafeAreaView, Text } from "react-native";

type OrderToScanProps = {
    orderId: number;
}

const OrderToScan = ({
     orderId,
 }: OrderToScanProps) => {

    return (
        <SafeAreaView>
            <Text>Hi!</Text>
            <Text>The Order Id is {orderId}</Text>
        </SafeAreaView>
    )
}

export default OrderToScan;