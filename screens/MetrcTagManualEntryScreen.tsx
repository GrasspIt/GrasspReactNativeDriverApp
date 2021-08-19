import React from 'react';

import MetrcTagManualEntryModal from "../components/MetrcTagManualEntryModal";

const MetrcTagManualEntryScreen = ({ navigation, route }) => {
    const { productName, productId, orderDetailId, orderId } = route.params;

    const submitTagEntry = (data) => {
    //    call backend with tag data
    //    if response is successful and there are remaining scans in the orderDetail, return to scanner
    //    if response is successful and there are not any more scans remaining in the orderDetail, return to OrderToScan
    //    In either case, for a successful response, show success message
    //    if there is an error, show an error message
    }

    return <MetrcTagManualEntryModal
        submitTagEntry={submitTagEntry}
        productName={productName}
        orderId={orderId}
        orderDetailid={orderDetailId}
        productId={productId}
        navigation={navigation}
    />
}

export default MetrcTagManualEntryScreen;