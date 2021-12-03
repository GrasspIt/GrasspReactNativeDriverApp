import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import OnCallSwitch from './OnCallSwitch';
import AlertSuccessOrError from "./AlertSuccessOrError";

//tests
import AutocompleteTest from "./AutoComplete";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"

type Props = {
  dspr;
  dsprDriver;
  isLoading: boolean;
  getDriverData;
  setDriverOnCallState;
  showLocationPermissionAlert: boolean;
  closeLocationPermissionAlert: () => any;
  locationPermissionAlertTitle: string;
  locationPermissionAlertText: string;
};

const DashboardDisplay = ({
  dspr,
  dsprDriver,
  isLoading,
  getDriverData,
  setDriverOnCallState,
  showLocationPermissionAlert,
  closeLocationPermissionAlert,
  locationPermissionAlertTitle,
  locationPermissionAlertText
}: Props) => {
  const { colors } = useTheme();

  //AutoComplete Dropdown Library Test
  const [selectedItem, setSelectedItem] = useState(null)

  const dropdownController = useRef(null)

  const handleUpdate = (evt) => {
    console.log('evt in handleUpdate:', evt);
    setSelectedItem(evt);
  }

  const handleOnBlur = () => {
    if (!selectedItem && dropdownController && dropdownController?.current) {
        dropdownController.current.clear()
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : dsprDriver ? (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Text style={styles.dsprTitle}>{dspr.name}</Text>
          {dsprDriver && (
            <OnCallSwitch
              isLoading={isLoading}
              setDriverOnCallState={setDriverOnCallState}
              dsprDriver={dsprDriver}
            />
          )}

        {/*  AutoComplete Test */}
          <AutocompleteTest
              value={''}
              style={{borderColor: 'green', borderWidth: 2, borderStyle: 'solid'}}
              containerStyle={{borderColor: 'blue', borderWidth: 2, borderStyle: 'solid'}}
              label="Model"
              data={['Honda', 'Yamaha', 'Suzuki', 'TVS']}
              menuStyle={{backgroundColor: 'white'}}
              onChange={() => {}}
          />

          {/* AutocompleteDropdown library test*/}

          <View>
            <AutocompleteDropdown
                controller={(controller) => {
                  dropdownController.current = controller
                }}
                clearOnFocus={false}
                closeOnBlur={true}
                onBlur={handleOnBlur}
                //initialValue={{ id: "2" }} // or just '2'
                onSelectItem={handleUpdate}
                //onChangeText={setAutoCompleteText}
                //textInputProps={{
                //  value: autoCompleteText,
                //}}
                dataSet={[
                  { id: "1", title: "Alpha" },
                  { id: "2", title: "Beta" },
                  { id: "3", title: "Gamma" }
                ]}
            />
            <Text style={{ color: "#668", fontSize: 13 }}>
              Selected item: {JSON.stringify(selectedItem)}
            </Text>
          </View>

        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text>Unable to fetch driver data.</Text>
          <Button disabled={isLoading} mode='text' onPress={getDriverData}>
            Try Again
          </Button>
        </View>
      )}
      <StatusBar style='dark' />

      {/*Modal used to prompt users to change location permissions*/}
      <AlertSuccessOrError
          isVisible={showLocationPermissionAlert}
          onDismiss={closeLocationPermissionAlert}
          title={locationPermissionAlertTitle}
          message={locationPermissionAlertText}
          buttonText={'Ok'}
          buttonOnPressSubmit={closeLocationPermissionAlert}
          customAnimationName={'locationPermission'}
          animationViewStyles={{marginTop: 16}}
          titleStyles={{marginTop: 12}}
          messageTextStyles={{marginTop: 16}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dsprTitle: {
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 20,
  },
});

export default DashboardDisplay;
