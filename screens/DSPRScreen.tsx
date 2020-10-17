import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDsprDriverId } from '../actions/driverActions';
import { State } from '../store/reduxStoreState';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerStackParamsList } from '../navigation/DrawerNavigator';
import { View, FlatList, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import DsprCard from '../components/DsprCard';

type DSPRScreenNavigationProp = StackNavigationProp<DrawerStackParamsList, 'DSPRs'>;
type Props = { navigation: DSPRScreenNavigationProp };

const DSPRScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const dsprs = useSelector<State, Object>((state) => state.api.entities.DSPRs);
  const dsprDataList = Object.values(dsprs);

  const dsprDrivers = useSelector<State, Object>((state) => state.api.entities.dsprDrivers);
  const dsprDriverDataList = dsprDrivers && Object.values(dsprDrivers);

  const handleSelectDspr = (dsprId: number) => {
    // find the dsprDriver that matches the dsprId
    const selectedDriver = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
    dispatch(setDsprDriverId(selectedDriver.id));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          paddingTop: 40,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            padding: 10,
          }}
        >
          Choose a Dispensary
        </Text>
      </View>
      <FlatList
        data={dsprDataList}
        renderItem={(item) => <DsprCard handleSelect={handleSelectDspr} dspr={item.item} />}
        keyExtractor={(item: any) => item.id.toString()}
      />
    </View>
  );
};

export default DSPRScreen;
