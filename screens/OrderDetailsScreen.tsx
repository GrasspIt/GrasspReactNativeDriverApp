import React, { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import Clipboard from 'expo-clipboard';
import { connect, shallowEqual, useSelector } from 'react-redux';
import { getOrderDetailsWithId } from '../actions/orderActions';
import { completeOrder, cancelOrder, markOrderInProcess } from '../actions/orderActions';
import { removeOrderAndRefreshRoute, deactivateDriverRoute } from '../actions/driverActions';
import { getUserFromProps, getUserNotesFromProps } from '../selectors/userSelectors';
import {
    getUserIdDocumentFromPropsWithOrder,
    getUserMedicalRecommendations,
} from '../selectors/userDocumentsSelector';
import Moment from 'moment';

import { StackNavigationProp } from '@react-navigation/stack';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { getOrderFromProps, getProductsInOrderFromProps, ProductInOrder } from '../selectors/orderSelectors';
import { getAddressFromProps } from '../selectors/addressSelectors';
import { getRouteLegs, getRoutes } from '../selectors/dsprDriverRouteSelectors';
import OrderDetailsDisplay from '../components/OrderDetailsDisplay';
import { getDSPRFromProps, isMetrcLicenseHeldByDSPRFromProps } from "../selectors/dsprSelectors";
import { DSPR, MetrcTag, State } from "../store/reduxStoreState";
import { number } from "prop-types";
import { getMetrcScanCountForOrderFromProps, getMetrcScansForOrderFromProps } from "../selectors/metrcSelectors";

type DetailsScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Details'>;

type Props = {
    navigation: DetailsScreenNavigationProp;
    order;
    orderId;
    user;
    address;
    userNotes;
    idDocument;
    medicalRecommendation;
    isLoading;
    getOrderDetailsWithId;
    orderIdsInRoute;
    activeRoute;
    completeOrder;
    cancelOrder;
    markOrderInProcess;
    removeOrderAndRefreshRoute;
    deactivateDriverRoute;
    dspr?: DSPR;
};
const OrderDetailsScreen = ({
                                navigation,
                                isLoading,
                                order,
                                orderId,
                                user,
                                address,
                                userNotes,
                                idDocument,
                                medicalRecommendation,
                                getOrderDetailsWithId,
                                orderIdsInRoute,
                                activeRoute,
                                completeOrder,
                                cancelOrder,
                                markOrderInProcess,
                                removeOrderAndRefreshRoute,
                                deactivateDriverRoute,
                                dspr,
                            }: Props) => {
    const orderDate = order && Moment(order.createdTime).format('MMMM Do YYYY, h:mm a');
    const birthDate = idDocument && Moment(idDocument.birthDate).format('MMMM Do YYYY');

    const isMetrcDSPR = useSelector<State, boolean | undefined>(state => dspr && isMetrcLicenseHeldByDSPRFromProps(state, {dsprId: dspr.id}), shallowEqual)
    const productsInOrder = useSelector<State, ProductInOrder[]>(state => orderId && getProductsInOrderFromProps(state, {orderId}), shallowEqual)

    const currentNumberOfScansForOrder = useSelector<State, number>(state => getMetrcScanCountForOrderFromProps(state, {orderId}), shallowEqual);
    const totalRequiredScansForOrder = useMemo(() => productsInOrder.reduce(((acc, currVal) => acc + currVal.quantity), 0), []);

    const isScanningComplete: boolean = isMetrcDSPR ? currentNumberOfScansForOrder === totalRequiredScansForOrder : true;

    //TODO: Finish implementing determination for if an order requires a metrc scan.
    //confirm property name for metrcLicense on DSPR object
    //TODO update DSPR interface in reduxStore

    const handleNavigate = () => {
        if (order && order.status) {
            if (order.orderStatus == 'completed' || order.orderStatus == 'canceled') navigation.goBack();
        }
    };

    const getOrderDetails = () => {
        if (order && order.id) getOrderDetailsWithId(order.id);
    };

    const orderStatusDefined = order && order.orderStatus;

    useEffect(() => {
        handleNavigate();
    }, [orderStatusDefined]);

    useEffect(() => {
        getOrderDetails();
    }, []);

    const handleManageNotes = () => {
        navigation.navigate('Notes', {userId: user.id, dsprDriverId: order.dsprDriver, userNotes});
    };

    const handleCopyToClipboard = async () => {
        await Clipboard.setString(medicalRecommendation.idNumber);
        Alert.alert('Copied to clipboard.');
    };

    console.log('order:', order);

    //TODO - pass requiresMetrcScan to OrderDetailsDisplay to determine if the 'Scan Order Button' should show instead of the complete order button (if all scans have NOT been completed)
    //if all scans have been completed, should the Complete Order Button render and the scan order button not render - or  should both render?
    return (
        <OrderDetailsDisplay
            navigation={navigation}
            isLoading={isLoading}
            order={order}
            orderDate={orderDate}
            birthDate={birthDate}
            orderId={orderId}
            user={user}
            address={address}
            userNotes={userNotes}
            idDocument={idDocument}
            medicalRecommendation={medicalRecommendation}
            getOrderDetails={getOrderDetails}
            getOrderDetailsWithId={getOrderDetailsWithId}
            orderIdsInRoute={orderIdsInRoute}
            activeRoute={activeRoute}
            handleManageNotes={handleManageNotes}
            handleCopyToClipboard={handleCopyToClipboard}
            completeOrder={completeOrder}
            cancelOrder={cancelOrder}
            markOrderInProcess={markOrderInProcess}
            removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
            deactivateDriverRoute={deactivateDriverRoute}
            isMetrcDSPR={isMetrcDSPR !== undefined ? isMetrcDSPR : false}
            isScanningComplete={isScanningComplete}
        />
    );
};

const mapStateToProps = (state, route) => {
    const {orderId} = route.route.params;
    const order = getOrderFromProps(state, {orderId});
    const user = order && getUserFromProps(state, {userId: order.user});
    const address = order && getAddressFromProps(state, {addressId: order.address});
    const userNotes = user && getUserNotesFromProps(state, {userId: user.id});
    const idDocument =
        user &&
        getUserIdDocumentFromPropsWithOrder(state, {
            userId: user.id,
            order: order,
        });
    const medicalRecommendations = getUserMedicalRecommendations(state);
    const medicalRecommendation = order && medicalRecommendations[order.userMedicalRecommendation];
    const isLoading = state.api.isLoading;
    const driverRoutes = getRoutes(state);
    const activeRoute =
        driverRoutes && Object.values(driverRoutes).filter((route) => route.active)[0];
    const routeLegs = Object.values(getRouteLegs(state));
    const activeRouteLegs =
        activeRoute && routeLegs && routeLegs.filter((leg) => activeRoute.legs.includes(leg.id));
    const orderIdsInRoute = activeRouteLegs && activeRouteLegs.map((leg) => leg.order);
    const dspr = order && getDSPRFromProps(state, {dsprId: order.dspr})
    return {
        order,
        orderId,
        user,
        address,
        userNotes,
        idDocument,
        medicalRecommendation,
        isLoading,
        orderIdsInRoute,
        activeRoute,
        dspr
    };
};

const mapDispatchToProps = {
    getOrderDetailsWithId,
    completeOrder,
    cancelOrder,
    markOrderInProcess,
    removeOrderAndRefreshRoute,
    deactivateDriverRoute,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsScreen);
