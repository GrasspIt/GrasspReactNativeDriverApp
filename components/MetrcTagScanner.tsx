import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Platform, StatusBar, Vibration } from "react-native";
import { ProductInOrder } from "../selectors/orderSelectors";
import { useTheme, Button, IconButton, Caption } from "react-native-paper";
import { BarCodeScanner } from 'expo-barcode-scanner';
import MetrcTagEntryModal from "./MetrcTagEntryModal";


type MetrcTagScannerProps = {
    navigation;
    productName: string;
    orderDetailId: string;
    productId: string;
    orderId: string;
    scanSubmit: (data) => any;
}

const MetrcTagScanner = ({ navigation, productName, scanSubmit, productId, orderDetailId, orderId }: MetrcTagScannerProps) => {

    const [hasPermission, setHasPermission] = useState<boolean | 'requesting-permission'>('requesting-permission');
    const [scanned, setScanned] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

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

    const toggleModalVisibility = () => {
        setModalVisible(!modalVisible);
    }

    //TODO ensure function can handle scanData passed from either Expo Scanner or Manual Entry Modal
    const handleScanSubmit = (scanData) => {
        setScanned(true);
        Vibration.vibrate();

        const {type, data} = scanData;

        console.log('Result from barcode scanner:', scanData);
        console.log('Barcode Type:', BarCodeScanner.Constants.BarCodeType[type]);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);

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
            {modalVisible && <MetrcTagEntryModal isVisible={modalVisible} toggleModalVisibility={toggleModalVisibility} /> }

            {!modalVisible &&
            <React.Fragment>

                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{productName}</Text>
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
                            onPress={() => navigation.navigate('MetrcTagManualEntry', { productName, productId, orderDetailId, orderId })}
                        />
                        <Text style={styles.buttonText}>Manual Entry</Text>
                    </View>

                </View>
            </React.Fragment>
            }
            {/*Alternative Implementation*/}
            {/*<BarCodeScanner*/}
            {/*    onBarCodeScanned={scanned ? undefined : handleScanSubmit}*/}
            {/*    style={StyleSheet.absoluteFillObject}*/}
            {/*/>*/}

            {/*<View style={styles.overlay}>*/}
            {/*    <View style={styles.unfocusedContainer} />*/}
            {/*    <View style={styles.middleContainer}>*/}
            {/*        <View style={styles.unfocusedContainer} />*/}

            {/*        /!*SCAN AREA*!/*/}
            {/*        <View style={styles.focusedContainer} />*/}

            {/*        <View style={styles.unfocusedContainer} />*/}
            {/*    </View>*/}
            {/*    <View style={styles.unfocusedContainer} />*/}
            {/*</View>*/}

            {/*{scanned && <Button onPress={() => setScanned(false)}> Tap to Scan Again </ Button>}*/}
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
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: 'violet',
        backgroundColor: opacity
    },
    title: {
        fontSize: 16,
        color: 'white',
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

//Alternative Implementation Styles
//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//    },
//
//    overlay: {
//        position: 'absolute',
//        top: 0,
//        left: 0,
//        right: 0,
//        bottom: 0,
//    },
//    unfocusedContainer: {
//        flex: 1,
//        backgroundColor: 'rgba(0,0,0,0.7)',
//    },
//    middleContainer: {
//        flexDirection: 'row',
//        flex: 1.5,
//    },
//    focusedContainer: {
//        flex: 6,
//    },
//});


export default MetrcTagScanner;