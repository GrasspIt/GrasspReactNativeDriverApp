import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
import { getOrderFromProps, } from '../selectors/orderSelectors';
import { getAddressFromProps } from '../selectors/addressSelectors';
import { getRouteLegs, getRoutes } from '../selectors/dsprDriverRouteSelectors';
import OrderDetailsDisplay from '../components/OrderDetailsDisplay';
import {
    getDSPRFromProps,
    isScanningRequiredForDSPRFromProps
} from "../selectors/dsprSelectors";
import { DSPR, State } from "../store/reduxStoreState";
import { getOrderScanCountForOrderFromProps, isScanningCompleteForOrderFromProps } from "../selectors/scanSelectors";

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
                                dspr
                            }: Props) => {
    const orderDate = order && Moment(order.createdTime).format('MMMM Do YYYY, h:mm a');
    const birthDate = idDocument && Moment(idDocument.birthDate).format('MMMM Do YYYY');

    const isScanningDSPR = useSelector<State, boolean | undefined>(state => dspr && isScanningRequiredForDSPRFromProps(state, {dsprId: dspr.id}), shallowEqual);
    const isScanningComplete = useSelector<State, boolean | undefined>(state => isScanningDSPR && isScanningCompleteForOrderFromProps(state, {orderId}), shallowEqual);

    //passed to OrderDetailsDisplay to ensure component card does not flicker on screen before rendering the loading spinner.
    //After component mounts, isLoadingOnInitialMount is set to false, and getOrderDetails is invoked, which sets isLoading to true
    const [isLoadingOnInitialMount, setIsLoadingOnInitialMount] = useState<boolean>(true);

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
        setIsLoadingOnInitialMount(false);
        getOrderDetails();
    }, []);

    const handleManageNotes = () => {
        navigation.navigate('Notes', {userId: user.id, dsprDriverId: order.dsprDriver, userNotes});
    };

    const handleCopyToClipboard = () => {
        Clipboard.setString(medicalRecommendation.idNumber);
        Alert.alert('Copied to clipboard.');
    };

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
            isScanningDSPR={!!isScanningDSPR}
            isScanningComplete={!!isScanningComplete}
            isLoadingOnInitialMount={isLoadingOnInitialMount}
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
    // const orderScans = order && getOrderScanCountForOrderFromProps(state, {orderId: order.id})
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
        dspr,
        // orderScans
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
