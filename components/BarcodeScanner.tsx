import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, StatusBar, Vibration } from "react-native";
import { useTheme, IconButton, Paragraph, Subheading } from "react-native-paper";
import { Camera } from "expo-camera"
import { BarCodeScanner } from 'expo-barcode-scanner';
import { OrderDetail } from "../store/reduxStoreState";
import AlertSuccessOrError from "./AlertSuccessOrError";
import AlertSuccessButtonsForRemainingScans from "./buttons/AlertSuccessButtonsForRemainingScans";
import { stat } from 'fs';


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
    unit?: string;
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
                            dsprId,
                            unit,
                        }: BarcodeScannerProps) => {

    const [hasPermission, setHasPermission] = useState<boolean | 'requesting-permission'>('requesting-permission');
    const [permissionsHere, setPermissionsHere] = useState<any>(undefined);

    const requiredScans = useMemo(() => {
        if(orderDetail){
            let detailQuantity = orderDetail.quantity
            switch (orderDetail.unit) {
                case "oz":
                    detailQuantity *= 8;
                    break;
                case "half":
                    detailQuantity *= 4;
                    break;
                case "quarter":
                    detailQuantity *= 2;
                    break;
                case "eighth":
                default:
                    break; 
            }
            return detailQuantity
        }
        return undefined;
    }, [orderDetail])

    useEffect(() => {
        (async () => {
            const {status} = await Camera.getCameraPermissionsAsync();
            if(!(status == "granted")) Camera.requestCameraPermissionsAsync().then((permissionResponse) => {
                if(permissionResponse.status === "granted") {
                    
                }
            });
            setPermissionsHere("Looking for permissions: " + status)
            setHasPermission(status === 'granted');
        })();
    }, []);

    /**Submit scanned Metrc Tag data (phone vibrates on scan) */
    const handleScanSubmit = (scanData) => {
        Vibration.vibrate();

        const {data} = scanData;

        scanSubmit(data);
    };

    /**Message to display when a scan is successful*/
    const successAlertMessage = (
        <View style={successAlertMessageStyle.view}>
            <Subheading style={successAlertMessageStyle.subheading}>{productName}</Subheading>
            <Paragraph>-- {scanCountForOrderDetail} of {requiredScans || "Loading..."} Scanned --</Paragraph>
        </View>
    )


    return hasPermission === true ? (
        <SafeAreaView style={styles.componentContainer}>

            <View style={styles.headerContainer}>
                <Text style={styles.title} numberOfLines={2}>{productName}</Text>
                <Text style={styles.subtitle}>
                    {unit && <>Unit: {unit.charAt(0).toUpperCase() + unit.slice(1)}   </>}
                    Scans: {scanCountForOrderDetail}/{requiredScans || "Loading..."}
                </Text>
            </View>

            {/*Based on Expo's Implementation*/}
            <View style={styles.scannerContainer}>
                <Camera
                    onBarCodeScanned={scannerDisabled ? undefined : handleScanSubmit}
                    style={[StyleSheet.absoluteFill]}
                    barCodeScannerSettings={{
                        barCodeTypes: [
                            BarCodeScanner.Constants.BarCodeType.qr,
                            BarCodeScanner.Constants.BarCodeType.code128
                        ],
                    }}
                >
                    <View style={styles.layerTop}/>
                    <View style={styles.layerCenter}>
                        <View style={styles.layerLeft}/>
                        <View style={styles.focused}/>
                        <View style={styles.layerRight}/>
                    </View>
                    <View style={styles.layerBottom}/>
                </Camera>
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
                                 buttonsContainer={(orderDetail && scanCountForOrderDetail < (requiredScans || 10000))
                                     ? <AlertSuccessButtonsForRemainingScans
                                         navigation={navigation}
                                         closeSuccessAlert={closeSuccessAlert}
                                         goBackOnPress={() => {
                                             closeSuccessAlert();
                                             navigation.goBack();
                                         }}
                                     />
                                     : undefined}
            />

            {/*Error Alert*/}
            <AlertSuccessOrError
                isVisible={errorAlertVisible}
                onDismiss={closeErrorAlert}
                title={'Scan Submission Failed!'}
                message={errorText || `The Scan submission for "${productName}" was not successful`}
                buttonText={'Retry'}
                buttonOnPressSubmit={closeErrorAlert}
                isError={true}
            />
        </SafeAreaView>
    ) : hasPermission === 'requesting-permission' ?  <SafeAreaView style={styles.cameraPermissiosContainer}>
            <Text style={{fontSize: 20}}>Requesting permission to use camera...</Text>
            <Text style={{fontSize: 20}}>{permissionsHere}</Text>
        </SafeAreaView>
        : <SafeAreaView style={styles.cameraPermissiosContainer}>
            <Text style={{fontSize: 20}}>Camera access has not been granted {hasPermission}</Text>
        </SafeAreaView>;}

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
        flex: 1,
        backgroundColor: opacity,
    },
    layerCenter: {
        flex: 2,
        flexDirection: 'row',
    },
    layerLeft: {
        flex: 2,
        backgroundColor: opacity,
    },
    focused: {
        flex: 8,
        borderColor: 'white',
        borderWidth: 4,
    },
    layerRight: {
        flex: 2,
        backgroundColor: opacity,
    },
    layerBottom: {
        //having flex: 1 produced a visual artifact, setting flex: 1.1 cleans this up
        flex: 1.1,
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