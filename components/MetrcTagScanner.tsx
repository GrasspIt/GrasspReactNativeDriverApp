import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, StatusBar, Vibration } from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { useTheme, Button, IconButton, Caption } from "react-native-paper";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { OrderDetail } from "../store/reduxStoreState";
import AlertSuccessOrError from "./AlertSuccessOrError";


type MetrcTagScannerProps = {
    navigation;
    productName: string;
    orderDetailId: string;
    productId: string;
    orderId: string;
    scanSubmit: (data) => any;
    scanCountForOrderDetail: number;
    orderDetail: OrderDetail | undefined;
    successAlertVisible: boolean;
    errorAlertVisible: boolean;
    closeSuccessAlert: () => any;
    closeErrorAlert: () => any;
    successAlertButtonText: string;
}

const MetrcTagScanner = ({
                             navigation,
                             productName,
                             scanSubmit,
                             productId,
                             orderDetailId,
                             orderId,
                             scanCountForOrderDetail,
                             orderDetail,
                             successAlertVisible,
                             errorAlertVisible,
                             closeSuccessAlert,
                             closeErrorAlert,
                             successAlertButtonText,
                         }: MetrcTagScannerProps) => {

    const [hasPermission, setHasPermission] = useState<boolean | 'requesting-permission'>('requesting-permission');
    const [scanned, setScanned] = useState<boolean>(false);

    const {colors} = useTheme();

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        console.log('Scanner has mounted!!!');

        return () => {
            console.log('Scanner has unmounted!!!!');
        }
    }, [])

    //TODO ensure function can handle scanData passed from either Expo Scanner or Manual Entry Modal
    const handleScanSubmit = (scanData) => {
        setScanned(true);
        Vibration.vibrate();

        const {type, data} = scanData;

        console.log('Result from barcode scanner:', scanData);
        console.log('Barcode Type:', BarCodeScanner.Constants.BarCodeType[type]);
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        scanSubmit(data);

        //    Call scanSubmit
        //    if response.error => show error
        //    if response.success && no more to scan => show check animation and then close (or close and then show check animation?)
        //    if response.success && quantity remains to scan => show check animation, (update title ?), allow user to keep scanning


    };

    if (hasPermission === 'requesting-permission') {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }


    return (
        <SafeAreaView style={styles.componentContainer}>

            <View style={styles.headerContainer}>
                <Text style={styles.title} numberOfLines={2}>{productName}</Text>
                <Text style={styles.subtitle}>Scans: {scanCountForOrderDetail}/{orderDetail?.quantity}</Text>
            </View>
            {/*Expo's implementation*/}
            <View style={styles.scannerContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleScanSubmit}
                    style={[StyleSheet.absoluteFill]}
                >
                    <View style={styles.layerTop}/>
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft}/>
                        <View style={styles.focused}/>
                        <View style={styles.layerRight}/>
                    </View>
                    <View style={styles.layerBottom}/>

                    {scanned && <Button onPress={() => setScanned(false)}> Tap to Scan Again </ Button>}
                </BarCodeScanner>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <IconButton
                        icon={'close-circle'}
                        size={40}
                        color={'white'}
                        style={{margin: 0}}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.buttonText}>Close</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <IconButton
                        icon={'keyboard-outline'}
                        size={40}
                        color={'white'}
                        style={{margin: 0}}
                        onPress={() => navigation.navigate('MetrcTagManualEntry', {
                            productName,
                            productId,
                            orderDetailId,
                            orderId
                        })}
                    />
                    <Text style={styles.buttonText}>Manual Entry</Text>
                </View>

            </View>

            {/*Success Alert*/}
            <AlertSuccessOrError isVisible={successAlertVisible}
                                 onDismiss={closeSuccessAlert}
                                 title={'Success!'}
                                 message={`The Metrc Tag for ${productName} has been successfully entered`}
                                 buttonText={successAlertButtonText}
                                 buttonOnPressSubmit={closeSuccessAlert}
            />

            {/*TODO - Test for different errors. Change error message to be whatever is returned from the backend*/}
            {/*Error Alert*/}
            <AlertSuccessOrError
                isVisible={errorAlertVisible}
                onDismiss={closeErrorAlert}
                title={'Error Encountered!'}
                message={`The Metrc tag submission for ${productName} was not successful`}
                buttonText={'Retry'}
                buttonOnPressSubmit={closeErrorAlert}
                isError={true}
            />
        </SafeAreaView>
    );
}
//TODO: Remove commented out stylings
//Expo Implementation Styles
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: opacity,
    },
    headerContainer: {
        alignItems: 'center',
        flex: 2,
        justifyContent: 'center',
        //backgroundColor: 'violet',
        backgroundColor: opacity
    },
    title: {
        fontSize: 16,
        color: 'white',
        //paddingTop: 8,
        paddingRight: 8,
        paddingLeft: 8
    },
    subtitle: {
        color: 'white',
        fontSize: 14,
        marginTop: 14,
    },
    scannerContainer: {
        flex: 9,
        flexDirection: 'column',
        //borderWidth: 2,
        //borderColor: 'white',
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity,
        //backgroundColor: 'lightgreen',
    },
    layerCenter: {
        //having flex: 2 produced a visual artifact, setting flex: 2.1 cleans this up
        flex: 2.1,
        flexDirection: 'row',
        //backgroundColor: 'blue',
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity,
        //backgroundColor: 'silver',
    },
    focused: {
        flex: 10,
        borderColor: 'white',
        borderWidth: 4,
        //backgroundColor: 'teal',
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
        //backgroundColor: 'brown'
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity,
        //backgroundColor: 'green',

    },
    buttonsContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: opacity,
        //backgroundColor: 'tomato',
    },
    buttonContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    buttonText: {
        color: 'white',
    }
});

export default MetrcTagScanner;