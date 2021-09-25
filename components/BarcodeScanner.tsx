import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, StatusBar, Vibration } from "react-native";
import { useTheme, IconButton, Paragraph, Subheading } from "react-native-paper";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { OrderDetail } from "../store/reduxStoreState";
import AlertSuccessOrError from "./AlertSuccessOrError";
import AlertSuccessButtonsForRemainingScans from "./buttons/AlertSuccessButtonsForRemainingScans";


type BarcodeScannerProps = {
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
    scannerDisabled: boolean;
    errorText: string;
    dsprId: number;
}

const BarcodeScanner = ({
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
                            scannerDisabled,
                            errorText,
                            dsprId
                        }: BarcodeScannerProps) => {

    const [hasPermission, setHasPermission] = useState<boolean | 'requesting-permission'>('requesting-permission');

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    /**Submit scanned Metrc Tag data (phone vibrates on scan) */
    const handleScanSubmit = (scanData) => {
        Vibration.vibrate();

        const { data } = scanData;

        scanSubmit(data);
    };

    if (hasPermission === 'requesting-permission') {
        return (
            <SafeAreaView style={styles.cameraPermissiosContainer}>
                <Text style={{fontSize: 20}}>Requesting permission to use camera...</Text>
            </SafeAreaView>
        )
    }
    if (!hasPermission) {
        return (
            <SafeAreaView style={styles.cameraPermissiosContainer}>
                <Text style={{fontSize: 20}}>Camera access has not been granted</Text>
            </SafeAreaView>
        )
    }

    /**Message to display when a scan is successful*/
    const successAlertMessage = (
        <View style={successAlertMessageStyle.view}>
            <Subheading style={successAlertMessageStyle.subheading}>{productName}</Subheading>
            <Paragraph>-- {scanCountForOrderDetail} of {orderDetail?.quantity} Scanned --</Paragraph>
        </View>
    )


    return (
        <SafeAreaView style={styles.componentContainer}>

            <View style={styles.headerContainer}>
                <Text style={styles.title} numberOfLines={2}>{productName}</Text>
                <Text style={styles.subtitle}>Scans: {scanCountForOrderDetail}/{orderDetail?.quantity}</Text>
            </View>

            {/*Based on Expo's Implementation*/}
            <View style={styles.scannerContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scannerDisabled ? undefined : handleScanSubmit}
                    style={[StyleSheet.absoluteFill]}
                >
                    <View style={styles.layerTop}/>
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft}/>
                        <View style={styles.focused}/>
                        <View style={styles.layerRight}/>
                    </View>
                    <View style={styles.layerBottom}/>
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
                        onPress={() => navigation.navigate('BarcodeManualEntry', {
                            productName,
                            productId,
                            orderDetailId,
                            orderId,
                            dsprId
                        })}
                    />
                    <Text style={styles.buttonText}>Manual Entry</Text>
                </View>

            </View>

            {/*Success Alert*/}
            <AlertSuccessOrError isVisible={successAlertVisible}
                                 onDismiss={closeSuccessAlert}
                                 title={'Scan Successful!'}
                                 message={successAlertMessage}
                                 buttonOnPressSubmit={closeSuccessAlert}
                                 buttonsContainer={(orderDetail && scanCountForOrderDetail < orderDetail?.quantity)
                                     ? <AlertSuccessButtonsForRemainingScans
                                         navigation={navigation}
                                         closeSuccessAlert={closeSuccessAlert}
                                     />
                                     : undefined}
            />

            {/*Error Alert*/}
            <AlertSuccessOrError
                isVisible={errorAlertVisible}
                onDismiss={closeErrorAlert}
                title={'Metrc Tag Submission Failed!'}
                message={errorText || `The Metrc tag submission for "${productName}" was not successful`}
                buttonText={'Retry'}
                buttonOnPressSubmit={closeErrorAlert}
                isError={true}
            />
        </SafeAreaView>
    );
}

export const successAlertMessageStyle = StyleSheet.create({
    view: {
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 12
    },
    subheading: {
        textAlign: 'center', marginBottom: 4
    }
})

//Based on Expo Implementation Styles
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    cameraPermissiosContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    componentContainer: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: opacity,
    },
    headerContainer: {
        alignItems: 'center',
        flex: 2,
        justifyContent: 'center',
        backgroundColor: opacity
    },
    title: {
        fontSize: 16,
        color: 'white',
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
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity,
    },
    layerCenter: {
        //having flex: 2 produced a visual artifact, setting flex: 2.1 cleans this up
        flex: 2.1,
        flexDirection: 'row',
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity,
    },
    focused: {
        flex: 10,
        borderColor: 'white',
        borderWidth: 4,
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity,
    },
    layerBottom: {
        //having flex: 2 produced a visual artifact, setting flex: 2.1 cleans this up
        flex: 2.1,
        backgroundColor: opacity,

    },
    buttonsContainer: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: opacity,
    },
    buttonContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    buttonText: {
        color: 'white',
    },
});

export default BarcodeScanner;