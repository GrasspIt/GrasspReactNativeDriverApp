import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { State } from "../store/reduxStoreState";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

import { Alert, View, Text, StyleSheet, FlatList } from "react-native";
import Colors from '../constants/Colors';
import DsprCard from "../components/DsprCard";

type DSPRScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'DSPRs'>;
type Props = {
    navigation: DSPRScreenNavigationProp;
    route;
}

const DSPRScreen = ({ route, navigation }: Props) => {

    const { driverIds } = route.params;
    const dsprs = useSelector<State, Object>(state => state.api.entities.DSPRs);
    const dsprDrivers = useSelector<State, Object>(state => state.api.entities.dsprDrivers);

    // need entities.DSPRs to include imageLocation

    const dsprDataList = Object.values(dsprs);
    let dsprDriverDataList;
    if (dsprDrivers) {
        dsprDriverDataList = Object.values(dsprDrivers);
    }

    const handleSelectDspr = (dsprId: string) => {
        // find the dsprDriver that matches the dsprId
        const selectedDriver = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
        // navigate to dashboard passing driverId as props
        navigation.navigate('Dashboard', { driverId: selectedDriver.id });
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dsprDataList}
                renderItem={item => <DsprCard handleSelect={handleSelectDspr} dspr={item.item}/>}
                keyExtractor={(item: any) => item.id.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light,
      alignItems: 'center',
      justifyContent: 'center',
    },
})

export default DSPRScreen;