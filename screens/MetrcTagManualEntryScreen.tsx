import React, { useState } from 'react';

import MetrcTagManualEntryModal from "../components/MetrcTagManualEntryModal";
import { ORDER_SCAN_SUBMIT_FAILURE, ORDER_SCAN_SUBMIT_SUCCESS, submitBarcodeScan } from "../actions/metrcActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { OrderDetail, State } from "../store/reduxStoreState";
import { getOrderDetailFromProps } from "../selectors/orderSelectors";
import { getOrderScanCountForOrderDetailFromProps } from "../selectors/metrcSelectors";

const MetrcTagManualEntryScreen = ({navigation, route}) => {
    const {productName, productId, orderDetailId, orderId} = route.params;
    const dispatch = useDispatch();

    const orderDetail = useSelector<State, OrderDetail | undefined>(state => getOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)
    const scanCountForOrderDetail = useSelector<State, number>(state => orderId && orderDetailId && getOrderScanCountForOrderDetailFromProps(state, {
        orderId,
        orderDetailId
    }), shallowEqual)

    const [successAlertVisible, setSuccessAlertVisible] = useState<boolean>(false);
    const [errorAlertVisible, setErrorAlertVisible] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');

    const showSuccessAlert = () => setSuccessAlertVisible(true);

    /**Close success alert modal. If there are no remaining scans for a product, return user to OrderToScan screen.
     *  additional navigation handled in buttons passed to AlertSuccessOrError
     * */
    const closeSuccessAlert = () => {
        setSuccessAlertVisible(false);

        //TODO: Decide where to send the user
        // -> if scans need to still be completed for the product, send driver back to scanner page
        // -> if scans are done for the product, send driver back to OrdersToScan page (This navigation is handled in the
        // onPress properties in the alert buttons)

        //return driver to OrderToScan (if scans/tag submissions complete for product)
        if (orderDetail && scanCountForOrderDetail >= orderDetail.quantity) {
            navigation.navigate('OrderToScan', {orderId});
            return;
        }
        //return driver to scanner page (if scans remain for product)
        navigation.goBack();
    }

    const showErrorAlert = () => setErrorAlertVisible(true);
    const closeErrorAlert = () => setErrorAlertVisible(false);

    const submitTagEntry = (tagText) => {
        //    call backend with tag tagText
        //    Before submitting text to backend, capitalize it
        //    if response is successful and there are remaining scans in the orderDetail, return to scanner (handled in buttons passed to alert)
        //    if response is successful and there are not any more scans remaining in the orderDetail, return to OrderToScan (handled by closeSuccessAlert)
        //    In either case, for a successful response, show success message
        //    if there is an error, show an error message
        //    showSuccessAlert();

        const metrcTag = tagText.toUpperCase();
        return dispatch<any>(submitBarcodeScan(metrcTag, parseInt(orderId), parseInt(productId), parseInt(orderDetailId)))
            .then((response) => {
                if (response.type === ORDER_SCAN_SUBMIT_SUCCESS) {
                    showSuccessAlert();
                }
                if (response.type === ORDER_SCAN_SUBMIT_FAILURE) {
                    showErrorAlert()
                    setErrorText(response.error)
                }
                return response;
            })
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
        scanCountForOrderDetail={scanCountForOrderDetail}
        orderDetailQuantity={orderDetail?.quantity}
        errorText={errorText}
    />
}

export default MetrcTagManualEntryScreen;