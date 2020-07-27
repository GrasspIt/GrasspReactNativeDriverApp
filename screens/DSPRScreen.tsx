import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getDSPR } from "../actions/dsprActions";

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
    const dsprs = useSelector<State, any>(state => state.api.entities.DSPRs);
    // need entities.DSPRs to include imageLocation

    const dsprData = Object.values(dsprs);


    const handleSelectDspr = (dsprId: string) => {
        console.log(dsprId)
        // find which driverId is attached to the selected dsprId and store in state
        // const selectedDriverId = driverIds.filter(driverId => driverId === dsprId)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={dsprData}
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