import React, { useState } from 'react';
import {
    refreshDSPRDriver,
    removeOrderAndRefreshRoute,
    deactivateDriverRoute,
} from '../actions/driverActions';
import { markOrderInProcess, cancelOrder } from '../actions/orderActions';
import {
    DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute,
    getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps
} from '../selectors/dsprDriverSelector';
import { getLoggedInUser } from '../selectors/userSelectors';
import { connect, shallowEqual, useSelector } from 'react-redux';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import OrderMainDisplay from "../components/OrderMainDisplay";
import { SetViewOptions } from "../components/RouteAndOrderViewButtons";
import { OrderWithAddressAndUser, State } from "../store/reduxStoreState";
import { getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps } from "../selectors/orderSelectors";

type OrderListScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Orders'>;
type Props = {
    navigation: OrderListScreenNavigationProp;
    driverId;
    loggedInUser;
    dsprDriver: DSPRDRiverWithUserAndOrdersAndServiceAreasAndCurrentRoute;
    isLoading;
    refreshDSPRDriver;
    removeOrderAndRefreshRoute;
    deactivateDriverRoute;
    markOrderInProcess;
    cancelOrder;
};

const OrderListScreen = ({
                             navigation,
                             driverId,
                             loggedInUser,
                             dsprDriver,
                             isLoading,
                             removeOrderAndRefreshRoute,
                             deactivateDriverRoute,
                             markOrderInProcess,
                             cancelOrder,
                             refreshDSPRDriver,
                         }: Props) => {

    const [orderView, setOrderView] = useState<SetViewOptions>('map');
    const [isFetchingDriver, setIsFetchingDriver] = useState<boolean>(false);

    const ordersWithAddressAndUser = useSelector<State, OrderWithAddressAndUser[]>(
        state => getQueuedAndInProcessOrdersWithAddressesAndUsersForDriverAsArrayFromProps(
            state, {dsprDriverId: dsprDriver ? dsprDriver.id: null}),
        shallowEqual);

    const getDriverData = () => {
        setIsFetchingDriver(true);
        refreshDSPRDriver(driverId).then(response => setIsFetchingDriver(false));
    };

    return loggedInUser && dsprDriver ? (
        <OrderMainDisplay
            navigation={navigation}
            dsprDriver={dsprDriver}
            isLoading={isLoading}
            getDriverData={getDriverData}
            removeOrderAndRefreshRoute={removeOrderAndRefreshRoute}
            deactivateDriverRoute={deactivateDriverRoute}
            markOrderInProcess={markOrderInProcess}
            cancelOrder={cancelOrder}
            orderView={orderView}
            setOrderView={setOrderView}
            isFetchingDriver={isFetchingDriver}
            ordersWithAddressAndUser={ordersWithAddressAndUser}
        />
    ) : null;
};

const mapStateToProps = (state) => {
    const driverId = state.api.dsprDriverId;
    const dsprDriver = getDSPRDriverWithUserAndOrdersAndServiceAreasAndCurrentRouteFromProps(state, {
        dsprDriverId: driverId,
    });
    const isLoading = state.api.isLoading;
    return {
        loggedInUser: getLoggedInUser(state),
        driverId,
        dsprDriver,
        isLoading,
    };
};

const mapDispatchToProps = {
    refreshDSPRDriver,
    removeOrderAndRefreshRoute,
    deactivateDriverRoute,
    markOrderInProcess,
    cancelOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderListScreen);
