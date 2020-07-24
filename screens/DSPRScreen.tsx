import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getLoggedInUser } from "../selectors/userSelectors";

import { State } from "../store/reduxStoreState";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from '../navigation/ScreenNavigator';

import { Alert, View, Text, StyleSheet, FlatList } from "react-native";
import Colors from '../constants/Colors';
import DsprCard from "../components/DsprCard";

type DSPRScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'DSPRs'>;
type Props = {
    navigation: DSPRScreenNavigationProp;
}

const DSPRScreen = ({ navigation }: Props) => {

    // const dispatch = useDispatch();
    // const loggedInUser = useSelector<State, User>(getLoggedInUser);
    // const errorMessage = useSelector<State, string>(state => state.api.errorMessage);
    const dsprs = useSelector<State, any>(state => state.api.entities.DSPRs);

    var dsprData = Object.values(dsprs)

    // useEffect(() => {
    //     if (loggedInUser) {
    //         dsprDrivers.length > 1 ? navigation.navigate('DSPRScreen')
    //         : navigation.navigate('Dashboard');
    //     }
    // });

    return (
        <View style={styles.container}>
            <FlatList
                data={dsprData}
                renderItem={item => <DsprCard dspr={item.item}/>}
                keyExtractor={item => item.id}
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