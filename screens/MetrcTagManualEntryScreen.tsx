import React, { useState } from 'react';

import MetrcTagManualEntryModal from "../components/MetrcTagManualEntryModal";

const MetrcTagManualEntryScreen = ({navigation, route}) => {
    const {productName, productId, orderDetailId, orderId} = route.params;

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);

    const showSuccessAlert = () => setSuccessAlertVisible(true);
    const closeSuccessAlert = () => {
        setSuccessAlertVisible(false);

        //TODO: Decide where to send the user
        // -> if scans need to still be completed for the product, send driver back to scanner page
        // -> if scans are done for the product, send driver back to OrdersToScan page
        //navigation.navigate('OrderToScan', {orderId})
    }

    const showErrorAlert = () => setErrorAlertVisible(true);
    const closeErrorAlert = () => setErrorAlertVisible(false);

    const submitTagEntry = (text) => {
        //    call backend with tag text
        //    Before submitting text to backend, capitalize it
        //    if response is successful and there are remaining scans in the orderDetail, return to scanner
        //    if response is successful and there are not any more scans remaining in the orderDetail, return to OrderToScan
        //    In either case, for a successful response, show success message
        //    if there is an error, show an error message
            showSuccessAlert();
        //showErrorAlert()
    }

    return <MetrcTagManualEntryModal
        submitTagEntry={submitTagEntry}
        productName={productName}
        orderId={orderId}
        orderDetailid={orderDetailId}
        productId={productId}
        navigation={navigation}
        successAlertVisible={successAlertVisible}
        errorAlertVisible={errorAlertVisible}
        closeSuccessAlert={closeSuccessAlert}
        closeErrorAlert={closeErrorAlert}
    />
}

export default MetrcTagManualEntryScreen;